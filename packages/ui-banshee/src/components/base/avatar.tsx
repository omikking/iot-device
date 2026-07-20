'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '../../lib/utils';

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'ui-banshee-relative ui-banshee-flex ui-banshee-size-12 ui-banshee-shrink-0 ui-banshee-overflow-hidden ui-banshee-rounded-full',
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('ui-banshee-aspect-square ui-banshee-size-full', className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        ' ui-banshee-bg-[#DDD3C1] ui-banshee-text-[#A68C5B] ui-banshee-font-medium ui-banshee-text-base ui-banshee-leading-none ui-banshee-flex ui-banshee-size-full ui-banshee-items-center ui-banshee-justify-center ui-banshee-rounded-full',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
