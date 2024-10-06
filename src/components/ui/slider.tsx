"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

interface SliderProps
	extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
	value: number[];
	onValueChange: (value: number[]) => void; // Standard Radix UI Slider change event
}

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	SliderProps
>(({ className, value, onValueChange, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		value={value} // Pass the current value to the slider
		onValueChange={onValueChange} // Trigger the handler when the slider value changes
		className={cn(
			"relative flex w-full touch-none select-none items-center",
			className
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	>
		<SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-300">
			<SliderPrimitive.Range className="absolute h-full bg-locker-600" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
	</SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
