import { SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants';
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_TITLE,
		short_name: 'Zombies Guides',
		description: SITE_DESCRIPTION,
		start_url: '/',
		display: 'standalone',
		background_color: '##09090b',
		theme_color: '#eb5910',
		icons: [
			{
				src: '/logo.png',
				sizes: '32x32',
				type: 'image/png',
			},
			{
				src: '/logo.webp',
				sizes: '128x128',
				type: 'image/webp',
			},
		],
	};
}
