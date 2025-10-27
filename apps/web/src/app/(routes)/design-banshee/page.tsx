'use client';
import {
  Button,
  Headline,
  Text,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
  TooltipProvider,
} from '@gsp/ui-banshee';

export default function Page() {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <Headline variant="xl" as="h1" color="foreground">
        Banshee Design System Page 🚀
      </Headline>
      <hr className="w-full border-neutral-2" />
      {/* Input Field, Drowdown, Calendar & Time Select */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Input Field, Dropdown, Calendar & Time Select 🚀
        </Headline>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Tooltip */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Tooltips 🚀
        </Headline>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Top</TooltipTrigger>

            <TooltipContent side="top">
              {/* TODO Fix arrow color line */}
              <TooltipArrow />
              This is a top tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Right</TooltipTrigger>

            <TooltipContent side="right">
              {/* TODO Fix arrow color line */}
              <TooltipArrow />
              This is a right tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Bottom</TooltipTrigger>

            <TooltipContent side="bottom">
              {/* TODO Fix arrow color line */}
              <TooltipArrow />
              This is a bottom tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Left</TooltipTrigger>

            <TooltipContent side="left">
              {/* TODO Fix arrow color line */}
              <TooltipArrow />
              This is a left tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Badge */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Badges 🚀
        </Headline>
        <Badge>Neutral</Badge>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Graph Time Range */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Graph Time Range 🚀
        </Headline>
        <Headline variant="medium" as="h2" color="foreground">
          (Component coming soon...)
        </Headline>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Button */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Buttons 🚀
        </Headline>
        <Button variant="primary" size="small">
          Button Primary Regular Small
        </Button>
        <Button variant="primary" size="large">
          Button Primary Regular Large
        </Button>
      </div>
      {/* Texts */}
      <hr className="w-full border-neutral-2" />
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Texts 🚀
        </Headline>
        <Text variant="medium" color={'foreground'}>
          Medium text
        </Text>
        <Text variant="medium" color={'foreground'} isBold>
          <a className="underline" href="https://www.google.se">
            Medium bold text
          </a>
        </Text>
        <Text variant="small" color={'foreground'}>
          Small text
        </Text>
        <Text variant="xs" color={'foreground'}>
          XS text
        </Text>
      </div>
      <hr className="w-full border-neutral-2" />
    </main>
  );
}
