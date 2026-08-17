import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				serif: ['"Playfair Display"', 'Georgia', 'serif'],
				display: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				night: {
					DEFAULT: 'hsl(var(--night))',
					deep: 'hsl(var(--night-deep))',
					soft: 'hsl(var(--night-soft))',
				},
				lamp: {
					DEFAULT: 'hsl(var(--lamp))',
					glow: 'hsl(var(--lamp-glow))',
					deep: 'hsl(var(--lamp-deep))',
				},
				cream: 'hsl(var(--cream))',
				paper: {
					DEFAULT: 'hsl(var(--paper))',
					soft: 'hsl(var(--paper-soft))',
				},
				ink: {
					DEFAULT: 'hsl(var(--ink))',
					soft: 'hsl(var(--ink-soft))',
				},
				blush: {
					DEFAULT: 'hsl(var(--blush))',
					deep: 'hsl(var(--blush-deep))',
				},
				sage: 'hsl(var(--sage))',
				gold: 'hsl(var(--gold))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.08)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' },
				},
				'float-soft': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' },
				},
				'footstep-in': {
					'0%': { opacity: '0', transform: 'scale(0.4)' },
					'60%': { opacity: '1', transform: 'scale(1.1)' },
					'100%': { opacity: '0.85', transform: 'scale(1)' },
				},
				'beam-sweep': {
					'0%': { opacity: '0', transform: 'translateY(8px) scaleY(0.8)' },
					'100%': { opacity: '1', transform: 'translateY(0) scaleY(1)' },
				},
				'dash-draw': {
					to: { strokeDashoffset: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
				'shimmer': 'shimmer 6s linear infinite',
				'float-soft': 'float-soft 4s ease-in-out infinite',
				'footstep-in': 'footstep-in 0.5s ease-out both',
				'beam-sweep': 'beam-sweep 1.1s ease-out both',
				'dash-draw': 'dash-draw 1.6s ease-out forwards',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
