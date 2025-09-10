const TestimonialCard = ({ icon: Icon, title, children, iconClassName }) => {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-neutral-100 p-8 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex justify-start text-black dark:text-white">
        {/* The Icon component is rendered here with a standardized size */}
        <Icon className={iconClassName} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
          {title}
        </h3>
        <div className="text-neutral-600 dark:text-neutral-400">{children}</div>
      </div>
    </div>
  )
}

export default TestimonialCard
