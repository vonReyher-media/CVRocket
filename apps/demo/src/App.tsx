import {
  CVRocketProvider,
  EmptyPage,
  MultiSelectionItemCard,
  MultiSelectPage,
  OneSelectionItemCard,
  OneSelectionItemLine,
  OneSelectPage,
  SliderSelectPage,
  ThankYouClassic,
  UniversalFormPage,
  UniversalInputField,
  UniversalSelectField,
  UniversalTextareaField,
} from '@cvrocket/core';

import z from 'zod';
import { CommandIcon } from 'lucide-react';

const exampleSchema = z.object({
  name: z.string().min(2, 'Bitte gib deinen Namen ein.'),
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein.'),
  bio: z.string().optional(),
  role: z.string().min(1, 'Bitte wähle eine Rolle.'),
});

const App = () => {
  return (
    <div>
      <CVRocketProvider
        onComplete={(data) => {
          console.log('Form completed:', data);
        }}
        onError={(error) => {
          console.error('Form error:', error);
        }}
        onStart={() => {
          console.log('Form started');
        }}
        onStepChange={(step) => {
          console.log('Step changed to:', step);
        }}
        persistData={true}
        warnBeforeUnload={true}
        protectFormNavigation={true}
      >
        <EmptyPage
          showAgb
          agbInfo={{
            text: 'I agree to the terms and conditions',
            linkText: 'Read more',
            linkHref: '#',
          }}
          className={'flex items-center justify-center flex-col'}
        >
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-8 px-6 py-36">
              <h1 className="text-center text-4xl font-extrabold tracking-tight leading-tight">
                Get started now <span className="text-indigo-600">Test</span>
              </h1>
              <p className="text-center text-lg text-muted-foreground max-w-prose">
                This form is built to help you craft landing pages with a{' '}
                <span className="font-semibold text-gray-900">
                  high conversion rate
                </span>
                .
              </p>
            </div>
          </div>
        </EmptyPage>
        <MultiSelectPage
          title="Multi Select Page"
          description="This is a multi select page"
          datakey="test1"
          required={2}
          showAgb
          showBackButtonOnThisPage={false} // TODO BUG
          agbInfo={{
            text: 'I agree to the terms and conditions',
            linkText: 'Read more',
            linkHref: '#',
          }}
        >
          <MultiSelectionItemCard
            label={'Ich fühle mich schlapp'}
            value={'hallo'}
            imageUrl={'https://picsum.photos/200/300'}
          />
          <MultiSelectionItemCard
            label={'test'}
            value={'e'}
            icon={<CommandIcon />}
            imageUrl={'https://picsum.photos/200/300'}
          />
          <MultiSelectionItemCard
            label={'essen'}
            value={'ee'}
            icon={<CommandIcon />}
            imageUrl={'https://picsum.photos/200/300'}
          />
          <MultiSelectionItemCard
            label={'tom'}
            value={'ew'}
            icon={<CommandIcon />}
            imageUrl={'https://picsum.photos/200/300'}
          />
          <MultiSelectionItemCard
            label={'er'}
            value={'ag'}
            icon={<CommandIcon />}
            imageUrl={'https://picsum.photos/200/300'}
          />
        </MultiSelectPage>

        <OneSelectPage
          title={'test'}
          datakey={'tt'}
          showAgb
          agbInfo={{
            text: 'I agree to the terms and conditions',
            linkText: 'Read more',
            linkHref: '#',
          }}
        >
          <OneSelectionItemCard
            label={'Ich fühle mich schlapp'}
            value={'hallo'}
            imageUrl={'https://picsum.photos/200/300'}
          />
          <OneSelectionItemCard
            label={'test'}
            value={'e'}
            icon={<CommandIcon />}
            imageUrl={'https://picsum.photos/200/300'}
          />
          <OneSelectionItemCard
            label={'essen'}
            value={'ee'}
            icon={<CommandIcon />}
            imageUrl={'https://picsum.photos/200/300'}
          />
        </OneSelectPage>

        <OneSelectPage
          title={'test'}
          datakey={'thomas'}
          showAgb
          agbInfo={{
            text: 'I agree to the terms and conditions',
            linkText: 'Read more',
            linkHref: '#',
          }}
        >
          <OneSelectionItemLine
            label={'Ich fühle mich schlapp'}
            value={'hallo'}
          />
          <OneSelectionItemLine
            label={'test'}
            value={'e'}
            icon={<CommandIcon />}
          />
          <OneSelectionItemCard
            label={'essen'}
            value={'ee'}
            icon={<CommandIcon />}
            imageUrl={'https://picsum.photos/200/300'}
          />
        </OneSelectPage>
        <SliderSelectPage
          title={'Wie viel Euro gibt du pro Monat aus?'}
          datakey={'testslider'}
          min={100}
          max={1000}
          suffix={'$'}
          showBackButtonOnThisPage={false}
        />
        <UniversalFormPage
          title="Profilinformationen"
          description="Bitte fülle dein Profil aus."
          datakey="profileForm"
          zodSchema={exampleSchema}
          showAgb
          agbInfo={{
            text: 'Ich akzeptiere die Nutzungsbedingungen',
            linkText: 'Mehr erfahren',
            linkHref: '#',
          }}
        >
          <UniversalInputField
            name="name"
            label="Name"
            placeholder="Max Mustermann"
          />
          <UniversalInputField
            name="email"
            type="email"
            label="E-Mail"
            placeholder="max@example.com"
          />
          <UniversalTextareaField
            name="bio"
            label="Kurzbeschreibung"
            placeholder="Beschreibe dich in wenigen Sätzen..."
            rows={4}
          />
          <UniversalSelectField
            name="role"
            label="Rolle"
            options={[
              { value: 'designer', label: 'Designer:in' },
              { value: 'developer', label: 'Entwickler:in' },
              { value: 'product', label: 'Produktmanager:in' },
            ]}
          />
        </UniversalFormPage>

        <ThankYouClassic
          title="Vielen Dank für deine Teilnahme!"
          description="Wir haben deine Informationen erhalten und werden uns in Kürze bei dir melden."
          linkText="Zurück zur Startseite"
          linkHref="#"
        />
      </CVRocketProvider>
    </div>
  );
};

export default App;
