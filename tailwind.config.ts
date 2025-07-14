import type { Config } from "tailwindcss";

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
				'fredoka': ['Fredoka', 'Comic Neue', 'cursive'],
				'comic': ['Comic Neue', 'Fredoka', 'cursive'],
				'playful': ['Fredoka', 'Comic Neue', 'Arial', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
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
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				audio: {
					primary: 'hsl(var(--audio-primary))',
					secondary: 'hsl(var(--audio-secondary))',
					tertiary: 'hsl(var(--audio-tertiary))'
				},
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
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.4)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(var(--primary) / 0.8)',
						transform: 'scale(1.02)'
					}
				},
				'wave': {
					'0%': { transform: 'scaleY(1)' },
					'50%': { transform: 'scaleY(1.5)' },
					'100%': { transform: 'scaleY(1)' }
				},
				'bounce-soft': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'recording-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 0 0 hsl(0 72% 51% / 0.7)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 0 20px hsl(0 72% 51% / 0)',
						transform: 'scale(1.1)'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'star-sparkle': {
					'0%, 100%': { 
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					},
					'50%': { 
						transform: 'scale(1.2) rotate(180deg)',
						opacity: '0.8'
					}
				},
				'celebration': {
					'0%': { 
						transform: 'scale(0.8) translateY(20px)',
						opacity: '0'
					},
					'50%': { 
						transform: 'scale(1.1) translateY(-10px)',
						opacity: '1'
					},
					'100%': { 
						transform: 'scale(1) translateY(0)',
						opacity: '1'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-15px)' }
				},
				'rainbow': {
					'0%': { filter: 'hue-rotate(0deg)' },
					'100%': { filter: 'hue-rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'wave': 'wave 1.5s ease-in-out infinite',
				'bounce-soft': 'bounce-soft 0.8s ease-in-out',
				'recording-pulse': 'recording-pulse 1s ease-in-out infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'star-sparkle': 'star-sparkle 2s ease-in-out infinite',
				'celebration': 'celebration 0.6s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'rainbow': 'rainbow 3s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
