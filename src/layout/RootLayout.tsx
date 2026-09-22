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
    <div className="  h-screen flex flex-col">


        <Navbar />

         { pathname === '/' &&   (<Banner />)}
        <main className="mx-auto p-4 w-full max-w-screen-xl my-8 flex-1">
            <Outlet />
        </main>
         { pathname === '/' &&(<Newsletter />)}

          {isSheetOpen &&  <Sheet/>}


          {
            activeNavMobile && <NavBarMobile />
          }
        <Footer />

       
    </div>
  )
}
