interface ProfileCardProps {
  name: string;
  currentCgpa?: number;
  targetCgpa?: number;
}

export default function ProfileCard({ name, currentCgpa, targetCgpa }: ProfileCardProps) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-lg">
      <h2 className="text-2xl font-bold">👋 Welcome Back, {name}</h2>

      <p className="mt-2 text-gray-400">
        Electronics & Communication Engineering
      </p>

      <div className="mt-6 space-y-2">
        <p>🎓 College: IARE</p>
        <p>📚 Semester: 3</p>
        <p>🎯 Goal: Core + IT Placements</p>
        {typeof currentCgpa === 'number' && (
          <p>📊 Current CGPA: {currentCgpa.toFixed(2)}</p>
        )}
        <p>📈 CGPA Target: {typeof targetCgpa === 'number' ? targetCgpa.toFixed(1) : '8.8'}+</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Dream Companies</h3>

        <ul className="mt-2 list-disc pl-5">
          <li>Qualcomm</li>
          <li>NVIDIA</li>
          <li>Texas Instruments</li>
          <li>Synopsys</li>
        </ul>
      </div>
    </div>
  );
}
