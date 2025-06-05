
import React from 'react';
import EnhancedPersonalityTest from './EnhancedPersonalityTest';

interface PersonalityTestProps {
  language: 'hi' | 'en';
}

const PersonalityTest: React.FC<PersonalityTestProps> = ({ language }) => {
  const handleTestComplete = (results: any) => {
    console.log('Personality test completed:', results);
    // You can add additional logic here to process the results
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <EnhancedPersonalityTest 
        language={language} 
        onComplete={handleTestComplete}
      />
    </div>
  );
};

export default PersonalityTest;
