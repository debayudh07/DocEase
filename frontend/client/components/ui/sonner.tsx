"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-green-50 group-[.toaster]:via-green-100/80 group-[.toaster]:to-green-50 group-[.toaster]:text-green-800 group-[.toaster]:border-green-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-green-600",
          actionButton:
            "group-[.toast]:bg-green-600 group-[.toast]:text-white group-[.toast]:hover:bg-green-700",
          cancelButton:
            "group-[.toast]:bg-green-100 group-[.toast]:text-green-700 group-[.toast]:hover:bg-green-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
