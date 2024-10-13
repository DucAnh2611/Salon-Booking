import { Lock, Mail, ShieldCheck } from "lucide-react";

export const FORGOT_PASSWORD_STEPS = [
    {
        step: 1,
        title: "Tài khoản của bạn",
        Icon: Mail,
    },
    {
        step: 2,
        title: "Xác thực tài khoản",
        Icon: ShieldCheck,
    },
    {
        step: 3,
        title: "Đặt lại mật khẩu",
        Icon: Lock,
    },
];
