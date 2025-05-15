import {
  CVRocketProvider,
  EmptyPage,
  MultiSelectionItemLine,
  MultiSelectPage,
  OneSelectionItemLine,
  OneSelectPage,
  SliderSelectPage,
  ThankYouClassic,
  UniversalFormPage,
  UniversalInputField,
  UniversalSelectField,
  UniversalSliderField,
  UniversalTextareaField,
} from '@vonreyher-media/cvrocket';
import { z } from 'zod';

export const Example001 = () => {
  return (
    <CVRocketProvider
      onStart={() => console.log('Survey started')}
      onStepChange={(step) => console.log('Moved to step:', step)}
      onComplete={async (data) => {
        console.log('Survey complete:', data);
        try {
          // submit data to server...
        } catch (error) {
          console.error('Error saving data:', error);
        }
      }}
    >
      {/* Introduction */}
      <EmptyPage
        className="flex flex-col items-center justify-center py-8"
        agbInfo={{ text: '', linkText: '', linkHref: '' }}
      >
        <h1 className="text-3xl font-bold mb-4 text-center">
          Horse Enthusiast Survey
        </h1>
        <p className="text-muted-foreground max-w-prose text-center">
          Thank you for joining. Your feedback helps us understand horse owners
          and enthusiasts.
        </p>
      </EmptyPage>

      {/* User Role */}
      <OneSelectPage
        header={{
          title: 'Your Role',
          description: 'What best describes your involvement with horses?',
        }}
        datakey="userRole"
      >
        <OneSelectionItemLine icon="🏠" label="Horse Owner" value="owner" />
        <OneSelectionItemLine
          icon="🏇"
          label="Rider/Enthusiast"
          value="rider"
        />
        <OneSelectionItemLine
          icon="🏰"
          label="Stable Owner/Manager"
          value="stable_owner"
        />
        <OneSelectionItemLine
          icon="❌"
          label="None of the above"
          value="none"
        />
      </OneSelectPage>

      {/* Currently Have Horses */}
      <OneSelectPage
        renderCondition={(data) =>
          data?.userRole === 'owner' || data?.userRole === 'stable_owner'
        }
        header={{
          title: 'Currently Have Horses',
          description: 'Do you currently own or manage any horses?',
        }}
        datakey="hasHorses"
        showAgb={false}
      >
        <OneSelectionItemLine icon="✅" label="Yes" value="yes" />
        <OneSelectionItemLine icon="❌" label="No" value="no" />
      </OneSelectPage>

      {/* Number of Horses (Owners) */}
      <SliderSelectPage
        renderCondition={(data) =>
          data?.hasHorses === 'yes' && data?.userRole === 'owner'
        }
        datakey="numHorsesOwned"
        unit=" horses"
        min={0}
        max={50}
        step={1}
        showIncrementButtons
        header={{
          title: 'Number of Horses Owned',
          description: 'How many horses do you own?',
          text_alignment: 'center',
        }}
        showAgb={false}
        agbInfo={{ text: '', linkText: '', linkHref: '' }}
      />

      {/* Number of Horses Boarded (Stable Owners) */}
      <SliderSelectPage
        renderCondition={(data) =>
          data?.hasHorses === 'yes' && data?.userRole === 'stable_owner'
        }
        datakey="numHorsesBoarded"
        unit=" horses"
        min={0}
        max={200}
        step={1}
        showIncrementButtons
        header={{
          title: 'Number of Horses Boarded',
          description: 'How many horses do you board or care for?',
          text_alignment: 'center',
        }}
        showAgb={false}
        agbInfo={{ text: '', linkText: '', linkHref: '' }}
      />

      {/* Horse Acquisition */}
      <UniversalFormPage
        renderCondition={(data) =>
          data?.hasHorses === 'yes' &&
          (data?.userRole === 'owner' || data?.userRole === 'stable_owner')
        }
        header={{
          title: 'Horse Acquisition',
          description:
            'How do you usually acquire your horses? Main method and details.',
        }}
        datakey="horseAcquisition"
        zodSchema={z.object({
          method: z.string().optional(),
          details: z.string().optional(),
        })}
      >
        <UniversalSelectField
          name="method"
          label="Main Acquisition Method"
          options={[
            { label: 'Purchase', value: 'purchase' },
            { label: 'Lease/Rental', value: 'lease' },
            { label: 'Breeding', value: 'breeding' },
            { label: 'Other', value: 'other' },
          ]}
        />
        <UniversalTextareaField
          name="details"
          label="Additional Details"
          placeholder="e.g. from breeders, imports, private sales"
          rows={4}
        />
      </UniversalFormPage>

      {/* Horse Details */}
      <UniversalFormPage
        renderCondition={(data) =>
          data?.hasHorses === 'yes' &&
          (data?.userRole === 'owner' || data?.userRole === 'stable_owner')
        }
        header={{
          title: 'Horse Details',
          description: 'Tell us more about your horses.',
        }}
        datakey="horseDetails"
        zodSchema={z.object({
          primaryBreed: z.string().optional(),
          specialNeeds: z.string().optional(),
        })}
      >
        <UniversalInputField
          name="primaryBreed"
          label="Primary Breed"
          placeholder="e.g. Thoroughbred, Arabian"
        />
        <UniversalTextareaField
          name="specialNeeds"
          label="Special Needs or Qualities"
          placeholder="e.g. dietary needs, training level"
          rows={3}
        />
      </UniversalFormPage>

      {/* Services Offered (Stable Owners) */}
      <MultiSelectPage
        renderCondition={(data) =>
          data?.userRole === 'stable_owner' && data?.hasHorses === 'yes'
        }
        header={{
          title: 'Services Offered',
          description: 'Which services do you offer at your stable?',
        }}
        datakey="stableServices"
      >
        {[
          ['🏇', 'Riding Lessons', 'lessons'],
          ['🐴', 'Boarding', 'boarding'],
          ['🐎', 'Training', 'training'],
          ['🩺', 'Veterinary Care', 'vet_care'],
          ['🐾', 'Therapy Programs', 'therapy'],
        ].map(([icon, label, value]) => (
          <MultiSelectionItemLine
            key={value}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
      </MultiSelectPage>

      {/* Horse Origins */}
      <MultiSelectPage
        renderCondition={(data) =>
          data?.hasHorses === 'yes' &&
          (data?.userRole === 'owner' || data?.userRole === 'stable_owner')
        }
        header={{
          title: 'Horse Origins',
          description: 'What regions are your horses originally from?',
        }}
        datakey="horseOrigins"
      >
        <MultiSelectionItemLine icon="🇺🇸" label="USA" value="usa" />
        <MultiSelectionItemLine icon="🇬🇧" label="UK" value="uk" />
        <MultiSelectionItemLine icon="🇶🇦" label="Arabia" value="arabia" />
        <MultiSelectionItemLine icon="🇫🇷" label="France" value="france" />
        <MultiSelectionItemLine icon="🌍" label="Other" value="other" />
      </MultiSelectPage>

      {/* Satisfaction */}
      <OneSelectPage
        renderCondition={(data) =>
          data?.hasHorses === 'yes' &&
          (data?.userRole === 'owner' || data?.userRole === 'stable_owner')
        }
        header={{
          title: 'Satisfaction',
          description:
            'How satisfied are you with your current horses or stable?',
        }}
        datakey="satisfaction"
      >
        {[
          ['😊', 'Very satisfied', 'very_satisfied'],
          ['🙂', 'Satisfied', 'satisfied'],
          ['😐', 'Neutral', 'neutral'],
          ['🙁', 'Dissatisfied', 'dissatisfied'],
          ['😞', 'Very dissatisfied', 'very_dissatisfied'],
        ].map(([icon, label, value]) => (
          <OneSelectionItemLine
            key={value}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
      </OneSelectPage>

      {/* Owner Challenges */}
      <MultiSelectPage
        renderCondition={(data) =>
          data?.userRole === 'owner' && data?.hasHorses === 'yes'
        }
        header={{
          title: 'Ownership Challenges',
          description: 'What challenges do you face as a horse owner?',
        }}
        datakey="ownerChallenges"
      >
        {[
          ['💰', 'High costs', 'high_costs'],
          ['🎯', 'Finding quality horses', 'finding_quality'],
          ['🤝', 'Integration with facilities', 'integration'],
          ['📞', 'Communication with caregivers', 'communication'],
          ['💬', 'Language barriers', 'language'],
        ].map(([icon, label, value]) => (
          <MultiSelectionItemLine
            key={value}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
        <MultiSelectionItemLine icon="➕" label="Other" value="other" />
      </MultiSelectPage>

      {/* Stable Owner Challenges */}
      <MultiSelectPage
        renderCondition={(data) =>
          data?.userRole === 'stable_owner' && data?.hasHorses === 'yes'
        }
        header={{
          title: 'Stable Challenges',
          description: 'What challenges do you face as a stable owner?',
        }}
        datakey="stableChallenges"
      >
        {[
          ['🏗️', 'Facility maintenance', 'maintenance'],
          ['⚖️', 'Regulatory compliance', 'compliance'],
          ['💼', 'Client coordination', 'coordination'],
          ['💰', 'Cost pressures', 'cost'],
          ['📞', 'Veterinarian access', 'vet_access'],
        ].map(([icon, label, value]) => (
          <MultiSelectionItemLine
            key={value}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
        <MultiSelectionItemLine icon="➕" label="Other" value="other" />
      </MultiSelectPage>

      {/* Reasons for Not Owning */}
      <UniversalFormPage
        renderCondition={(data) =>
          data?.userRole === 'none' || data?.hasHorses === 'no'
        }
        header={{
          title: 'Why Not Quited',
          description: 'Why are you not owning or managing horses currently?',
        }}
        datakey="noHorseReasons"
        zodSchema={z.object({ reasons: z.string().optional() })}
      >
        <UniversalTextareaField
          name="reasons"
          label="Reasons"
          placeholder="e.g. cost, lack of time, space constraints"
          rows={4}
        />
      </UniversalFormPage>

      {/* Future Plans */}
      <OneSelectPage
        header={{
          title: 'Future Plans',
          description:
            'Do you plan to own or manage horses within the next year?',
        }}
        datakey="futurePlans"
      >
        <OneSelectionItemLine icon="✅" label="Yes" value="yes" />
        <OneSelectionItemLine icon="❌" label="No" value="no" />
        <OneSelectionItemLine icon="❓" label="Unsure" value="unsure" />
      </OneSelectPage>

      {/* Preferred Lease Duration */}
      <OneSelectPage
        renderCondition={(data) => data?.futurePlans === 'yes'}
        header={{
          title: 'Preferred Lease Duration',
          description: 'If leasing, what duration do you prefer?',
        }}
        datakey="leaseDuration"
      >
        <OneSelectionItemLine
          icon="⏱️"
          label="Short-term (< 3 months)"
          value="short"
        />
        <OneSelectionItemLine
          icon="⏳"
          label="Medium (3-12 months)"
          value="medium"
        />
        <OneSelectionItemLine
          icon="⌛"
          label="Long-term (> 12 months)"
          value="long"
        />
        <OneSelectionItemLine icon="🔄" label="Flexible" value="flexible" />
      </OneSelectPage>

      {/* Riding Areas */}
      <MultiSelectPage
        renderCondition={(data) =>
          data?.futurePlans === 'yes' || data?.hasHorses === 'yes'
        }
        header={{
          title: 'Riding Areas',
          description: 'Where do you primarily ride or board horses?',
        }}
        datakey="ridingAreas"
      >
        {[
          ['🏞️', 'Trails', 'trails'],
          ['🏟️', 'Arenas', 'arenas'],
          ['🌾', 'Fields/Pastures', 'fields'],
          ['🏡', 'Private Property', 'private'],
        ].map(([icon, label, value]) => (
          <MultiSelectionItemLine
            key={value}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
        <MultiSelectionItemLine icon="➕" label="Other" value="other" />
      </MultiSelectPage>

      {/* Evaluation Criteria */}
      <UniversalFormPage
        renderCondition={(data) => data?.hasHorses === 'yes'}
        header={{
          title: 'Evaluation Criteria',
          description:
            'Rate how important these criteria are when choosing a stable or horse.',
        }}
        datakey="evaluationCriteria"
        zodSchema={z.object({
          care: z.number().min(1).max(5),
          cost: z.number().min(1).max(5),
          facilities: z.number().min(1).max(5),
          location: z.number().min(1).max(5),
          flexibility: z.number().min(1).max(5),
          reputation: z.number().min(1).max(5),
        })}
      >
        <UniversalSliderField
          name="care"
          label="Quality of Care"
          min={1}
          max={5}
          step={1}
        />
        <UniversalSliderField
          name="cost"
          label="Cost"
          min={1}
          max={5}
          step={1}
        />
        <UniversalSliderField
          name="facilities"
          label="Facilities"
          min={1}
          max={5}
          step={1}
        />
        <UniversalSliderField
          name="location"
          label="Location"
          min={1}
          max={5}
          step={1}
        />
        <UniversalSliderField
          name="flexibility"
          label="Flexibility"
          min={1}
          max={5}
          step={1}
        />
        <UniversalSliderField
          name="reputation"
          label="Reputation"
          min={1}
          max={5}
          step={1}
        />
      </UniversalFormPage>

      {/* Adoption to Permanent (For Leasers) */}
      <OneSelectPage
        renderCondition={(data) =>
          Boolean(data?.leaseDuration && data?.leaseDuration !== 'flexible')
        }
        header={{
          title: 'Permanent Adoption',
          description:
            'Have you adopted a leased horse permanently in the last year?',
        }}
        datakey="adoptedPermanent"
      >
        <OneSelectionItemLine icon="✅" label="Yes" value="yes" />
        <OneSelectionItemLine icon="❌" label="No" value="no" />
        <OneSelectionItemLine icon="❓" label="Planned" value="planned" />
      </OneSelectPage>

      {/* Contact Information */}
      <UniversalFormPage
        header={{
          title: 'Contact Info',
          description:
            'Please provide your contact details to receive the results.',
        }}
        datakey="contactInfo"
        zodSchema={z.object({
          name: z.string().min(2),
          email: z.string().email(),
          phone: z.string().optional(),
        })}
        showAgb
        agbInfo={{
          text: 'I agree to data processing for research',
          linkText: 'Privacy policy',
          linkHref: 'https://example.com/privacy',
        }}
      >
        <UniversalInputField
          name="name"
          label="Name"
          placeholder="e.g. Jane Doe"
        />
        <UniversalInputField
          name="email"
          type="email"
          label="Email"
          placeholder="e.g. jane@example.com"
        />
        <UniversalInputField
          name="phone"
          type="tel"
          label="Phone (optional)"
          placeholder="e.g. +1 555 123 4567"
        />
      </UniversalFormPage>

      {/* Thank You */}
      <ThankYouClassic
        title="Thank You!"
        description="We appreciate your time and will share the survey results soon."
      />
    </CVRocketProvider>
  );
};
