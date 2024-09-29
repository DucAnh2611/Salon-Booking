import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-accent text-accent-foreground py-8 border-muted-foreground border-t">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Về Chúng Tôi</h3>
                        <p className="text-sm">
                            Chúng tôi là một công ty chuyên cung cấp các dịch vụ
                            và sản phẩm xuất sắc cho khách hàng.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Liên Kết Nhanh
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm hover:text-gray-900"
                                >
                                    Trang Chủ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="text-sm hover:text-gray-900"
                                >
                                    Dịch Vụ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products"
                                    className="text-sm hover:text-gray-900"
                                >
                                    Sản Phẩm
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm hover:text-gray-900"
                                >
                                    Liên Hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Liên Hệ Chúng Tôi
                        </h3>
                        <p className="text-sm">
                            123 Đường Chính, Thành Phố, Việt Nam 12345
                        </p>
                        <p className="text-sm">Điện thoại: (123) 456-7890</p>
                        <p className="text-sm">Email: info@example.com</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Theo Dõi Chúng Tôi
                        </h3>
                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <Facebook size={24} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <Twitter size={24} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <Instagram size={24} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <Linkedin size={24} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Tên Công Ty Của Bạn.
                        Đã đăng ký bản quyền.
                    </p>
                </div>
            </div>
        </footer>
    );
}
