export const formatMoney = (money: number) => {
    return money.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
};
