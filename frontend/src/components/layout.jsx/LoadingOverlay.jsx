const LoadingOverlay = ({ isLoading, children }) => {
  return (
    <div className="relative">
      {children}

      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;