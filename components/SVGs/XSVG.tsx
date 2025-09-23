import type { SVGProps } from "react"

interface XSVGProps extends SVGProps<SVGSVGElement> {}

export default function XSVG({ ...props }: XSVGProps) {
	return (
		<svg
			{...props}
			stroke="currentColor"
			fill="currentColor"
			strokeWidth="0"
			viewBox="0 0 16 16"
			height="30"
			width="30"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="X"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.60022 2H5.80022L8.78759 6.16842L12.4002 2H14.0002L9.5118 7.17895L14.4002 14H10.2002L7.21285 9.83158L3.60022 14H2.00022L6.48864 8.82105L1.60022 2ZM10.8166 12.8L3.93657 3.2H5.18387L12.0639 12.8H10.8166Z"
				fill="currentColor"
			/>
		</svg>
	)
}
