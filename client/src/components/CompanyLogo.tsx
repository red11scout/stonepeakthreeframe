import { getCompanyLogo } from "@/lib/logoMap";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  companyName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export function CompanyLogo({ 
  companyName, 
  size = 'md', 
  className,
  showFallback = true 
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);
  const logoUrl = getCompanyLogo(companyName);

  if (!logoUrl || hasError) {
    if (!showFallback) return null;
    return (
      <div 
        className={cn(
          "flex items-center justify-center rounded-md bg-muted",
          sizeClasses[size],
          className
        )}
      >
        <Building2 className={cn("text-muted-foreground", iconSizeClasses[size])} />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${companyName} logo`}
      className={cn(
        "object-contain rounded-md",
        sizeClasses[size],
        className
      )}
      onError={() => setHasError(true)}
    />
  );
}

export default CompanyLogo;
