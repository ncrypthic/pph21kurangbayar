"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var enquirer_1 = require("enquirer");
var penghitungPPH = function (tarif) { return function (pkp) {
    if (pkp < tarif.min) {
        return { pajak: 0, pkp: pkp };
    }
    var applicableAmount = pkp - tarif.min;
    if (applicableAmount < 0) {
        return { pajak: 0, pkp: 0 };
    }
    var pajak = Math.floor(applicableAmount * tarif.rate);
    var newPkp = pkp - applicableAmount;
    console.log("tarif: ".concat(tarif.name, ", pkp: ").concat(pkp, ", applicableAmount: ").concat(applicableAmount, ", rate: ").concat(tarif.rate, ", pajak: ").concat(pajak, ", newPkp: ").concat(newPkp));
    return { pajak: pajak, pkp: newPkp };
}; };
var tarifPPH = [
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
        rate: 25e-2
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
var calculator = function (ptkp) { return function (pkp) { return tarifPPH.map(penghitungPPH).reduce(function (aggr, calc) {
    var _a = calc(aggr.amount), pajak = _a.pajak, pkp = _a.pkp;
    aggr.amount = pkp;
    aggr.pajak += pajak;
    return aggr;
}, { company: pkp.company, pajak: 0, amount: pkp.amount - ptkp.amount }); }; };
var hitungPPH21 = function (listA1, ptkp) {
    return listA1.map(calculator(ptkp));
};
var hitungNormalPPH21 = function (listA1, ptkp) {
    var aggrPKP = listA1.reduce(function (aggr, a1) {
        return aggr + a1.amount;
    }, 0);
    var res = calculator(ptkp)({ company: 'aggr', amount: aggrPKP });
    return { company: 'aggregate', amount: aggrPKP, pajak: res.pajak };
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var promptPKP, promptPTKP, a1, input_1, input, ptkp, pphNormal, pphKurangBayar, aggrPPH21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                promptPKP = [
                    {
                        name: 'company',
                        type: 'input',
                        message: 'perusahaan'
                    },
                    {
                        name: 'amount',
                        type: 'input',
                        message: 'Penghasilan bersih (A1 baris 14) ?'
                    },
                    {
                        name: 'more',
                        type: 'confirm',
                        message: 'Tambah A1?',
                        initial: false
                    }
                ];
                promptPTKP = {
                    name: 'amount',
                    type: 'text',
                    message: 'Penghasilan TIDAK kena pajak?'
                };
                a1 = [];
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, enquirer_1.prompt)(promptPKP)];
            case 2:
                input_1 = _a.sent();
                a1.push({
                    company: input_1.company,
                    amount: parseFloat(input_1.amount)
                });
                if (!input_1.more) {
                    return [3 /*break*/, 3];
                }
                return [3 /*break*/, 1];
            case 3: return [4 /*yield*/, (0, enquirer_1.prompt)(promptPTKP)];
            case 4:
                input = _a.sent();
                ptkp = { amount: parseFloat(input.amount) };
                pphNormal = hitungNormalPPH21(a1, ptkp);
                console.log("[NORMAL] PKP: ".concat(pphNormal.amount, ", PPH: ").concat(pphNormal.pajak));
                if (a1.length > 1) {
                    pphKurangBayar = hitungPPH21(a1, __assign({ amount: a1.length * ptkp.amount }, ptkp));
                    aggrPPH21 = pphKurangBayar.reduce(function (aggr, pph21) {
                        aggr += pph21.pajak;
                        return aggr;
                    }, 0);
                    console.log("[".concat(a1.length, " pemotong pajak] PKP: ").concat(pphNormal.amount, ", PPH: ").concat(aggrPPH21));
                    console.log("Jumlah kurang bayar: ".concat(pphNormal.pajak - aggrPPH21));
                }
                return [2 /*return*/];
        }
    });
}); };
main();
