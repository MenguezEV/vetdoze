export default function Home() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-4xl font-bold text-teal-800 mb-4">🐾 Welcome to VetDoze</h1>
      <p className="text-gray-600 mb-8">
        Precision veterinary dosage calculator grounded in Plumb's Veterinary Drug Handbook.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-2xl mb-2">💊</p>
          <h2 className="font-semibold text-gray-800 mb-1">Dosage Calculator</h2>
          <p className="text-sm text-gray-500">Accurate dose computation for dogs and cats by weight and breed.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-2xl mb-2">🎓</p>
          <h2 className="font-semibold text-gray-800 mb-1">Student Mode</h2>
          <p className="text-sm text-gray-500">Practice cases with instant feedback for vet students.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-2xl mb-2">🏠</p>
          <h2 className="font-semibold text-gray-800 mb-1">Owner View</h2>
          <p className="text-sm text-gray-500">Simple treatment instructions for pet owners.</p>
        </div>
      </div>
    </div>
  );
}