import Footer from "@/components/Footer/Footer"

interface IMainLayout {
  children: React.ReactNode
}

export default function MainLayout({ children }: IMainLayout) {
  return (
    <>
      <main className="mt-10 mb-4 grow" role="main">
        { children }
      </main>
      <Footer />
    </>
  )
}
