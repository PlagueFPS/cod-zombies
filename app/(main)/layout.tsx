import Footer from "@/components/footer/footer"

export default function MainLayout({ children }: LayoutProps<"/">) {
	return (
		<>
			<main className="mt-10 mb-4 grow">{children}</main>
			<Footer />
		</>
	)
}
