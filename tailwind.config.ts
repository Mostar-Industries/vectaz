
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
				// Custom MoStar color palette
				mostar: {
					'dark': '#0A0E17',
					'darkest': '#050810', // Keeping existing darkest shade
					'blue': '#0039e6',
					'light-blue': '#00a2ff',
					'cyan': '#00ffff',
					'purple': '#6b46c1',
					'magenta': '#f81ce5',
					'bright-magenta': '#ff00ff', // Keeping existing bright-magenta
					'pink': '#ff00a0',
					'green': '#00ff9d',
					'yellow': '#ffca00',
					'terminal-green': '#0f3', // Keeping existing terminal colors
					'terminal-blue': '#33a1ff',
				},
				// Neon gradient colors
				neon: {
					'blue': '#33a1ff',
					'cyan': '#00ffff',
					'purple': '#9500ff',
					'magenta': '#f81ce5',
					'bright-magenta': '#ff00ff', // Keeping existing bright-magenta
					'green': '#00ff9d',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'display': ['"Rajdhani"', 'sans-serif'],
				'body': ['"Inter"', 'sans-serif'],
				'mono': ['"JetBrains Mono"', 'monospace'],
			},
			boxShadow: {
				'neon-blue': '0 0 5px #33a1ff, 0 0 20px rgba(51, 161, 255, 0.3)',
				'neon-cyan': '0 0 5px #00ffff, 0 0 20px rgba(0, 255, 255, 0.3)',
				'neon-purple': '0 0 5px #9500ff, 0 0 20px rgba(149, 0, 255, 0.3)',
				'neon-magenta': '0 0 5px #f81ce5, 0 0 20px rgba(248, 28, 229, 0.3)',
				'neon-bright-magenta': '0 0 10px #ff00ff, 0 0 30px rgba(255, 0, 255, 0.5)',
				'neon-green': '0 0 5px #00ff9d, 0 0 20px rgba(0, 255, 157, 0.3)',
				'cyber-glow': '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.2), 0 0 30px rgba(0, 255, 255, 0.1)',
				'terminal': '0 0 10px rgba(0, 162, 255, 0.7), 0 0 20px rgba(0, 162, 255, 0.3)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'brightness(1)',
					},
					'50%': { 
						opacity: '0.8',
						filter: 'brightness(1.2)',
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'data-flow': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-100%)' },
				},
				'blob': {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' },
				},
				'scan-line': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(100vh)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'fade-in-up': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'glitch': {
					'0%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-5px, 5px)' },
					'40%': { transform: 'translate(-5px, -5px)' },
					'60%': { transform: 'translate(5px, 5px)' },
					'80%': { transform: 'translate(5px, -5px)' },
					'100%': { transform: 'translate(0)' },
				},
				'text-gradient': {
					'0%': { 'background-position': '0% 50%' },
					'100%': { 'background-position': '100% 50%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'data-flow': 'data-flow 10s linear infinite',
				'blob': 'blob 7s infinite',
				'scan-line': 'scan-line 6s linear infinite',
				'fade-in': 'fade-in 0.6s ease-in-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'glitch': 'glitch 0.8s ease-in-out',
				'text-gradient': 'text-gradient 8s ease infinite',
				"spin-slow": "spin 8s linear infinite",
			},
			backgroundImage: {
				'grid-pattern': 'radial-gradient(circle, rgba(0, 162, 255, 0.1) 1px, transparent 1px)',
				'cyber-grid': 'linear-gradient(rgba(0, 162, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 162, 255, 0.07) 1px, transparent 1px)',
				'cyber-grid-magenta': 'linear-gradient(rgba(248, 28, 229, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(248, 28, 229, 0.05) 1px, transparent 1px)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'neon-glow': 'linear-gradient(180deg, rgba(0, 255, 255, 0) 0%, rgba(0, 255, 255, 0.1) 100%)',
				'blue-magenta-gradient': 'linear-gradient(90deg, #33a1ff, #f81ce5)',
				'cyan-green-gradient': 'linear-gradient(90deg, #00ffff, #00ff9d)',
				'purple-magenta-gradient': 'linear-gradient(90deg, #9500ff, #f81ce5)',
				'magenta-purple-gradient': 'linear-gradient(90deg, #ff00ff, #9500ff)',
				'blue-green-gradient': 'linear-gradient(90deg, #0039e6, #00ff9d)',
				'terminal-grid': 'linear-gradient(rgba(51, 161, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 161, 255, 0.03) 1px, transparent 1px)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.text-glow': {
					'text-shadow': '0 0 10px var(--tw-text-opacity)',
				},
				'.text-glow-blue': {
					'text-shadow': '0 0 10px rgba(51, 161, 255, 0.7)',
				},
				'.text-glow-cyan': {
					'text-shadow': '0 0 10px rgba(0, 255, 255, 0.7)',
				},
				'.text-glow-green': {
					'text-shadow': '0 0 10px rgba(0, 255, 157, 0.7)',
				},
				'.text-glow-magenta': {
					'text-shadow': '0 0 10px rgba(248, 28, 229, 0.7)',
				},
				'.text-glow-bright-magenta': {
					'text-shadow': '0 0 15px rgba(255, 0, 255, 0.9)',
				},
				'.text-gradient': {
					'background-clip': 'text',
					'-webkit-background-clip': 'text',
					'color': 'transparent',
					'background-size': '300% 300%',
					'animation': 'text-gradient 8s ease infinite',
				},
				'.glassmorphism': {
					'background': 'rgba(10, 14, 23, 0.6)',
					'backdrop-filter': 'blur(12px)',
					'border': '1px solid rgba(255, 255, 255, 0.1)',
				},
				'.glassmorphism-dark': {
					'background': 'rgba(5, 8, 16, 0.7)',
					'backdrop-filter': 'blur(12px)',
					'border': '1px solid rgba(51, 161, 255, 0.2)',
				},
				'.glassmorphism-terminal': {
					'background': 'rgba(10, 14, 23, 0.7)',
					'backdrop-filter': 'blur(4px)',
					'border': '1px solid rgba(51, 161, 255, 0.3)',
					'box-shadow': '0 0 10px rgba(0, 162, 255, 0.1)',
				},
				'.glassmorphism-card': {
					'background': 'rgba(5, 8, 16, 0.6)',
					'backdrop-filter': 'blur(10px)',
					'border': '1px solid rgba(51, 161, 255, 0.1)',
					'transition': 'all 0.3s ease',
				},
				'.glassmorphism-card-magenta': {
					'background': 'rgba(5, 8, 16, 0.6)',
					'backdrop-filter': 'blur(10px)',
					'border': '1px solid rgba(248, 28, 229, 0.15)',
					'transition': 'all 0.3s ease',
				},
				'.glassmorphism-card-green': {
					'background': 'rgba(5, 8, 16, 0.6)',
					'backdrop-filter': 'blur(10px)',
					'border': '1px solid rgba(0, 255, 157, 0.15)',
					'transition': 'all 0.3s ease',
				},
				'.clip-path-slant': {
					'clip-path': 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
				},
				'.clip-path-angle': {
					'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 85%)',
				},
				'.cyber-terminal': {
					'background': 'rgba(10, 14, 23, 0.95)',
					'border': '1px solid rgba(51, 161, 255, 0.3)',
					'box-shadow': 'inset 0 0 30px rgba(0, 0, 0, 0.5), 0 0 10px rgba(51, 161, 255, 0.2)',
				},
				'.cyber-button': {
					'position': 'relative',
					'background': 'rgba(5, 8, 16, 0.8)',
					'backdrop-filter': 'blur(4px)',
					'border': '1px solid rgba(51, 161, 255, 0.3)',
					'box-shadow': '0 0 5px rgba(51, 161, 255, 0.2)',
					'transition': 'all 0.3s ease',
				},
				'.cyber-button:hover': {
					'background': 'rgba(51, 161, 255, 0.1)',
					'box-shadow': '0 0 15px rgba(51, 161, 255, 0.3)',
				},
				'.cyber-button:after': {
					'content': '""',
					'position': 'absolute',
					'bottom': '0',
					'left': '0',
					'width': '100%',
					'height': '2px',
					'background': 'linear-gradient(90deg, transparent, rgba(51, 161, 255, 0.6), transparent)',
					'transform': 'scaleX(0.3)',
					'opacity': '0.5',
					'transition': 'all 0.3s ease',
				},
				'.cyber-button:hover:after': {
					'opacity': '1',
					'transform': 'scaleX(1)',
				},
				'.cyber-panel': {
					'border': '1px solid rgba(51, 161, 255, 0.2)',
					'background': 'rgba(5, 8, 16, 0.7)',
					'box-shadow': 'inset 0 0 50px rgba(0, 0, 0, 0.3), 0 0 10px rgba(51, 161, 255, 0.15)',
				},
				'.cyber-panel-magenta': {
					'border': '1px solid rgba(248, 28, 229, 0.2)',
					'background': 'rgba(5, 8, 16, 0.7)',
					'box-shadow': 'inset 0 0 50px rgba(0, 0, 0, 0.3), 0 0 10px rgba(248, 28, 229, 0.15)',
				},
			};
			addUtilities(newUtilities);
		},
	],
} satisfies Config;
