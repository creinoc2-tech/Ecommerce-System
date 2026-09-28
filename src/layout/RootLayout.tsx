import { Outlet, useLocation } from "react-router"
import { Footer } from "../components/shared/Footer"
import { Navbar } from "../components/shared/NavBar";
import { Banner } from "../components/home/Banner";
import { Newsletter } from "../components/home/Newsletter";
import { Sheet } from "../components/shared/Sheet";
import { useGlobalStore } from "../store/global.state";
import { NavBarMobile } from "../components/shared/NavBarMobile";

export const RootLayout = () => {
    const { pathname } = useLocation()
    const isSheetOpen = useGlobalStore(state => state.isSheetOpen)
    const activeNavMobile = useGlobalStore(state => state.activeNavMobile)
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        {pathname === '/' && <Banner />}
        <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 lg:px-8">
            <Outlet />
        </main>
        {pathname === '/' && <Newsletter />}
        {isSheetOpen && <Sheet />}
        {activeNavMobile && <NavBarMobile />}
        <Footer />
    </div>
  )
}
