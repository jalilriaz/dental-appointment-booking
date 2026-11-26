"use client";

import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import {
    SELECTABLE_PAYMENT_METHODS,
    type PaymentIconKey,
    type PaymentMethodValue,
} from "@/lib/constants/payment-methods";

function MethodIcon({ kind }: { kind: PaymentIconKey }) {
    if (kind === "cash") return <PaymentsOutlined sx={{ fontSize: 15 }} />;
    if (kind === "card") return <CreditCardOutlined sx={{ fontSize: 15 }} />;
    if (kind === "bank") return <AccountBalanceOutlined sx={{ fontSize: 15 }} />;
    if (kind === "phone") return <SmartphoneOutlined sx={{ fontSize: 15 }} />;
    if (kind === "wallet") return <AccountBalanceWalletOutlined sx={{ fontSize: 15 }} />;
    return <LanguageOutlined sx={{ fontSize: 15 }} />;
}

interface PaymentMethodSelectorProps {
    value: PaymentMethodValue;
    onChange: (value: PaymentMethodValue) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SELECTABLE_PAYMENT_METHODS.map((m) => {
                const active = value === m.value;
                return (
                    <button
                        key={m.value}
                        type="button"
                        onClick={() => onChange(m.value)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            active
                                ? "bg-teal-600 border-teal-600 text-white shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        <MethodIcon kind={m.icon} />
                        <span className="truncate">{m.shortLabel}</span>
                    </button>
                );
            })}
        </div>
    );
}
