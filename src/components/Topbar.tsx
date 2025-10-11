import { Navbar, NavbarBrand } from "flowbite-react";

export default function Topbar() {
    return <Navbar className="border-b border-gray-200 mb-5 py-3 shadow-xs">
        <NavbarBrand>
            <span className="whitespace-nowrap text-xl font-semibold text-gray-800 dark:text-white">Game Listing Compilation</span>
        </NavbarBrand>
    </Navbar>;
}