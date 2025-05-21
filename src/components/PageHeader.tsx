import React from 'react';

interface PageHeaderProps {
  title: string;
  image: string;
}

const PageHeader = React.memo(function PageHeader({ title, image }: PageHeaderProps) {
  return (
    <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${image})`,
          filter: 'brightness(0.6)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white text-center px-4">
          {title}
        </h1>
      </div>
    </div>
  );
});

export default PageHeader;