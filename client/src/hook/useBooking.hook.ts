import { BookingContext } from "@/context/booking.context";
import { useContext } from "react";

export default function useBooking() {
    return useContext(BookingContext);
}
