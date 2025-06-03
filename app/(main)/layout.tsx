import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

interface IMainLayout {
  children: React.ReactNode
}

export default function MainLayout({ children }: IMainLayout) {
  return (
    <>
      <Header />
      <main className="mt-10 mb-4 grow" role="main">
        { children }
      </main>
      <Footer />
    </>
  )
}
