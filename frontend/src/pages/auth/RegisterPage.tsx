import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Surface } from '@/components/ui/Surface';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/ui/BrandMark';
import { Wordmark } from '@/components/ui/Wordmark';
import { Badge } from '@/components/ui/Badge';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-between py-12 px-4 bg-tech-grid">
      <Container size="sm" className="my-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <BrandMark size={36} />
            <Wordmark />
          </Link>
          <Badge variant="orange" className="mx-auto block w-max">
            SERVICE REGISTRATION PREVIEW
          </Badge>
        </div>

        <Surface variant="surface" elevation="md" className="p-8 sm:p-10 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#F4512C]/10 text-[#F4512C] flex items-center justify-center mb-6">
            <UserPlus className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-display font-bold text-[#17212B] mb-3">
            Book a Service / Register
          </h1>

          <p className="text-sm text-[#66737E] leading-relaxed mb-6">
            Interactive customer service booking, vehicle onboarding, and account registration flows will be fully integrated with backend endpoints in <strong className="text-[#17212B]">Part 7</strong>.
          </p>

          <div className="p-4 bg-[#F2F7F8] rounded-lg border border-[#17212B]/08 text-xs font-mono-tech text-[#66737E] mb-6">
            STATUS: REGISTRATION FLOW PREPARED • NO FAKE SUBMISSIONS
          </div>

          <Button href="/" variant="primary" size="lg" className="w-full justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Landing Page
          </Button>
        </Surface>
      </Container>

      <footer className="text-center text-xs font-mono-tech text-[#66737E] pt-8">
        AutoServe Platform Architecture • Part 6A Frontend Baseline
      </footer>
    </div>
  );
};
