import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: About,
  
})

interface AboutProps {
  tamara: string;
}

function About({ tamara }: AboutProps) {
  return <div className="p-2">Hello from About {tamara}!</div>
}