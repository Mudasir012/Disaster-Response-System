import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const liquidButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 outline-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:scale-105 duration-300 transition text-primary',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 text-xs gap-1.5 px-4',
        lg: 'h-10 rounded-md px-6',
        xl: 'h-12 rounded-md px-8',
        xxl: 'h-14 rounded-md px-10',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'xxl',
    },
  }
)

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

function LiquidGlassDecoration() {
  return (
    <>
      <div
        className="absolute inset-0 rounded-md transition-all duration-300
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]
          dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]
          group-hover:scale-105 group-active:scale-[0.97]"
      />
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-md"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />
    </>
  )
}

const LiquidButton = forwardRef(function LiquidButton(
  { className, variant, size, asChild = false, children, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button'

  if (asChild) {
    return (
      <div className="relative group inline-flex">
        <LiquidGlassDecoration />
        <Comp
          ref={ref}
          className={cn(liquidButtonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Comp>
        <GlassFilter />
      </div>
    )
  }

  return (
    <Comp
      ref={ref}
      className={cn(
        'relative group',
        liquidButtonVariants({ variant, size, className })
      )}
      {...props}
    >
      <LiquidGlassDecoration />
      <span className="relative z-10">{children}</span>
      <GlassFilter />
    </Comp>
  )
})

export { LiquidButton }
