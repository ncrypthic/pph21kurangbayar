import {prompt} from 'enquirer';

interface TarifPPH {
  name: string,
  min: number;
  max: number;
  rate: number;
}

interface PKP {
  company: string;
  amount: number;
}

interface PTKP {
  amount: number;
}

interface PPH21 {
  company: string;
  pajak: number;
  amount: number;
}

type Calculator = (pkp: number) => {pajak: number, pkp: number}

const penghitungPPH = (tarif: TarifPPH): Calculator => (pkp: number): {pajak: number, pkp: number} => {
  if (pkp < tarif.min) {
    return {pajak: 0, pkp};
  }
  const applicableAmount = pkp - tarif.min;
  if(applicableAmount < 0) {
    return {pajak: 0, pkp: 0};
  }
  const pajak = Math.floor(applicableAmount * tarif.rate);
  const newPkp = pkp - applicableAmount;
  console.log(`tarif: ${tarif.name}, pkp: ${pkp}, applicableAmount: ${applicableAmount}, rate: ${tarif.rate}, pajak: ${pajak}, newPkp: ${newPkp}`);
  return {pajak, pkp: newPkp};
};

const tarifPPH: TarifPPH[] = [
  {
    name: '35%',
    min: 5e9,
    max: 1e16,
    rate: 35e-2
  },
  {
    name: '30%',
    min: 5e18,
    max: 5e9,
    rate: 3e-1
  },
  {
    name: '25%',
    min: 2.5e8,
    max: 5e8,
    rate: 25e-2,
  },
  {
    name: '15%',
    min: 5e7,
    max: 2.5e8,
    rate: 15e-2
  },
  {
    name: '5%',
    min: 0,
    max: 5e7,
    rate: 5e-2
  },
];

const calculator = (ptkp: PTKP) => (pkp: PKP): PPH21 => tarifPPH.map(penghitungPPH).reduce((aggr, calc) => {
  const {pajak, pkp} = calc(aggr.amount);
  aggr.amount = pkp;
  aggr.pajak += pajak;
  return aggr;
}, {company: pkp.company, pajak: 0, amount: pkp.amount - ptkp.amount});

const hitungPPH21 = (listA1: PKP[], ptkp: PTKP): PPH21[] => {
  return listA1.map(calculator(ptkp));
}

const hitungNormalPPH21 = (listA1: PKP[], ptkp: PTKP): PPH21 => {
  const aggrPKP = listA1.reduce((aggr, a1) => {
    return aggr + a1.amount;
  }, 0)
  const res = calculator(ptkp)({company: 'aggr', amount: aggrPKP});
  return {company: 'aggregate', amount: aggrPKP, pajak: res.pajak};
}

const main = async () => {
  const promptPKP = [
    {
      name: 'company',
      type: 'input',
      message: 'perusahaan'
    },
    {
      name: 'amount',
      type: 'input',
      message: 'Penghasilan bersih (A1 baris 14) ?',
    },
    {
      name: 'more',
      type: 'confirm',
      message: 'Tambah A1?',
      initial: false
    }
  ]
  const promptPTKP = {
    name: 'amount',
    type: 'text',
    message: 'Penghasilan TIDAK kena pajak?',
  }
  const a1: PKP[] = [];
  while(true) {
    const input: { company: string; amount: string; more: boolean } = await prompt(promptPKP);
    a1.push({
      company: input.company,
      amount: parseFloat(input.amount),
    })
    if(!input.more) {
      break;
    }
  }
  const input: {amount: string}= await prompt(promptPTKP);
  const ptkp = {amount: parseFloat(input.amount)};
  const pphNormal = hitungNormalPPH21(a1, ptkp);
  console.log(`[NORMAL] PKP: ${pphNormal.amount}, PPH: ${pphNormal.pajak}`);
  if(a1.length > 1) {
    const pphKurangBayar = hitungPPH21(a1, {amount: a1.length * ptkp.amount, ...ptkp } as PTKP)
    const aggrPPH21 = pphKurangBayar.reduce((aggr, pph21) => {
      aggr += pph21.pajak;
      return aggr;
    }, 0);
    console.log(`[${a1.length} pemotong pajak] PKP: ${pphNormal.amount}, PPH: ${aggrPPH21}`);
    console.log(`Jumlah kurang bayar: ${pphNormal.pajak - aggrPPH21}`);
  }
}

main();
