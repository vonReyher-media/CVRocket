import {
  CVRocketProvider,
  EmptyPage,
  MultiSelectionItemCard,
  MultiSelectionItemLine,
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
  useToast,
} from '@vonreyher-media/cvrocket';

import z from 'zod';
import { CommandIcon } from 'lucide-react';
import { ThemeToggle } from './components/light-dark-mode-switch.tsx';

const exampleSchema = z.object({
  name: z.string().min(2, 'Bitte gib deinen Namen ein.'),
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein.'),
  bio: z.string().optional(),
  role: z.string().min(1, 'Bitte wähle eine Rolle.'),
});

const App = () => {
  const toast = useToast();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <ThemeToggle />
      <div className="container mx-auto ">
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
            if (step === 2) {
              toast.showToast(
                'Du hast es fast geschaft :) nur noch 3 schritte',
              );
            }
          }}
          loadingComponent={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">
                  Wird gesendet...
                </p>
              </div>
            </div>
          }
          fullScreenLayout={{
            // logo: 'https://www.cvrocket.com/wp-content/uploads/2023/09/cvrocket-logo.svg',
            // logoHref: 'https://www.cvrocket.com/',
            brandName: 'CVRocket',
            // drawerInformation: {
            //   title: 'Information',
            //   description: 'Hier sind einige Informationen zu diesem Formular.',
            //   drawerContent: (
            //     <div>
            //       <p>Hier ist der Inhalt des Drawers.</p>
            //     </div>
            //   ),
            // },
          }}
          // persistData={true}
          // warnBeforeUnload={true}
          // protectFormNavigation={true}
        >
          <EmptyPage
            agbInfo={{
              text: 'I agree to the terms and conditions',
              linkText: 'Read more',
              linkHref: '#',
            }}
            className={'flex items-center justify-center flex-col'}
          >
            <div className="w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-8 px-6 py-36">
                <h1 className="text-center text-6xl  tracking-tight leading-tight">
                  Start now with your new{' '}
                  <span className="text-primary">Onlinescore</span>
                </h1>
                <p className="text-center text-lg text-muted-foreground max-w-prose">
                  This form is built to help you craft landing pages with a{' '}
                  <span className="font-semibold text-foreground/80">
                    high conversion rate
                  </span>
                  .
                </p>
              </div>
            </div>
          </EmptyPage>

          <MultiSelectPage
            header={{
              title: 'Test',
              description: 'test',
            }}
            datakey="test1"
            renderCondition={() => {
              return false;
            }}
          >
            <MultiSelectionItemCard
              label={'Ich fühle mich schlapp'}
              value={'test'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              label={'Ich fühle mich nicht schlapp'}
              value={'tom'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              label={'keine Ahnung'}
              value={'hallo'}
              imageUrl={'https://picsum.photos/200/300'}
            />
          </MultiSelectPage>

          {/* <MultiSelectPage
            header={{
              title: 'Test',
              description:
                'Seit über 10 Jahren ist der App Store ein sicherer und vertrauenswürdiger Ort, um Apps zu entdecken und zu laden. Aber der App Store ist mehr als ein Schau­fenster.',
              information: {
                title: 'Test',
                description: 'test',
              },
              text_alignment: 'center',
            }}
            datakey="test1"
            required={2}
            showAgb
            showBackButtonOnThisPage={true} // TODO BUG
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
            header={{
              title: 'Test',
              description:
                'Seit über 10 Jahren ist der App Store ein sicherer und vertrauenswürdiger Ort, um Apps zu entdecken und zu laden. Aber der App Store ist mehr als ein Schau­fenster.',
            }}
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
            header={{
              title: 'Test',
              description:
                'Seit über 10 Jahren ist der App Store ein sicherer und vertrauenswürdiger Ort, um Apps zu entdecken und zu laden. Aber der App Store ist mehr als ein Schau­fenster.',
            }}
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
          </OneSelectPage> */}
          <SliderSelectPage
            datakey={'testslider'}
            min={100}
            max={1000}
            suffix={'$'}
            showIncrementButtons={true}
            showAgb={true}
            agbInfo={{
              text: 'I agree to the terms and conditions',
              linkText: 'Read more',
              linkHref: '#',
            }}
            header={{
              title: 'Wie viel Euro gibt du pro Monat aus?',
              text_alignment: 'center',
              description:
                'Seit über 10 Jahren ist der App Store ein sicherer und vertrauenswürdiger Ort, um Apps zu entdecken und zu laden. Aber der App Store ist mehr als ein Schau­fenster.',
            }}
          />

          {/* Branchenauswahl */}
          <OneSelectPage
            header={{
              title: 'Branche',
              description: 'In welcher Branche ist Ihr Unternehmen tätig?',
            }}
            datakey="industry"
          >
            <OneSelectionItemLine
              icon="🏭"
              label="Industrie & Produktion"
              value="industry"
            />
            <OneSelectionItemLine icon="💻" label="IT & Software" value="it" />
            <OneSelectionItemLine
              icon="🏥"
              label="Gesundheitswesen"
              value="healthcare"
            />
            <OneSelectionItemLine
              icon="🏗️"
              label="Bau & Handwerk"
              value="construction"
            />
            <OneSelectionItemLine
              icon="🚗"
              label="Automobil"
              value="automotive"
            />
            <OneSelectionItemLine
              icon="🏪"
              label="Handel & Einzelhandel"
              value="retail"
            />
            <OneSelectionItemLine
              icon="🏢"
              label="Dienstleistungen"
              value="services"
            />
            <OneSelectionItemLine
              icon="📦"
              label="Logistik & Transport"
              value="logistics"
            />
            <OneSelectionItemLine
              icon="🏛️"
              label="Öffentlicher Sektor"
              value="public"
            />
            <OneSelectionItemLine
              icon="🏦"
              label="Banken & Finanzen"
              value="finance"
            />
            <OneSelectionItemLine
              icon="🎓"
              label="Bildung & Forschung"
              value="education"
            />
            <OneSelectionItemLine
              icon="🏨"
              label="Gastgewerbe & Tourismus"
              value="hospitality"
            />
            <OneSelectionItemLine
              icon="📱"
              label="Telekommunikation"
              value="telecom"
            />
            <OneSelectionItemLine
              icon="🔬"
              label="Chemie & Pharma"
              value="chemical"
            />
            <OneSelectionItemLine
              icon="⚡"
              label="Energie & Versorgung"
              value="energy"
            />
            <OneSelectionItemLine icon="❓" label="Sonstige" value="other" />
          </OneSelectPage>

          <OneSelectPage
            header={{
              title: 'Branche',
              description: 'In welcher Branche ist Ihr Unternehmen tätig?',
            }}
            datakey="industry"
          >
            <OneSelectionItemLine
              description="Industrie & Produktion is a good industry to work in"
              icon="🏭"
              label="Industrie & Produktion"
              value="industry"
            />
            <OneSelectionItemLine
              description="Industrie & Produktion is a good industry to work in"
              icon="💻"
              label="IT & Software"
              value="it"
            />
            <OneSelectionItemLine
              description="Industrie & Produktion is a good industry to work in"
              icon="🏥"
              label="Gesundheitswesen"
              value="healthcare"
            />
            <OneSelectionItemLine
              description="Industrie & Produktion is a good industry to work in"
              icon="🏗️"
              label="Bau & Handwerk"
              value="construction"
            />
            <OneSelectionItemLine
              description="Industrie & Produktion is a good industry to work in"
              icon="🚗"
              label="Automobil"
              value="automotive"
            />
            <OneSelectionItemLine
              description="Industrie & Produktion is a good industry to work in"
              icon="🏪"
              label="Handel & Einzelhandel"
              value="retail"
            />
            <OneSelectionItemLine
              description="Industrie & Produktion is a good industry to work in"
              icon="🏢"
              label="Dienstleistungen"
              value="services"
            />
          </OneSelectPage>

          <OneSelectPage
            header={{
              title: 'Branche',
              description: 'In welcher Branche ist Ihr Unternehmen tätig?',
            }}
            datakey="industry"
          >
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="🏭"
              label="Industrie & Produktion"
              value="industry"
            />
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="💻"
              label="IT & Software"
              value="it"
            />
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="🏥"
              label="Gesundheitswesen"
              value="healthcare"
            />
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="🏗️"
              label="Bau & Handwerk"
              value="construction"
            />
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="🚗"
              label="Automobil"
              value="automotive"
            />
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="🏪"
              label="Handel & Einzelhandel"
              value="retail"
            />
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="🏢"
              label="Dienstleistungen"
              value="services"
            />
          </OneSelectPage>

          <OneSelectPage
            header={{
              title: 'Branche',
              description: 'In welcher Branche ist Ihr Unternehmen tätig?',
            }}
            datakey="industry"
          >
            <OneSelectionItemCard
              imageUrl="https://picsum.photos/200/300"
              description="Industrie & Produktion is a good industry to work in"
              icon="🏭"
              label="Industrie & Produktion"
              value="industry"
            />
            <OneSelectionItemCard
              imageUrl="https://picsum.photos/200/300"
              description="Industrie & Produktion is a good industry to work in"
              icon="💻"
              label="IT & Software"
              value="it"
            />
            <OneSelectionItemCard
              imageUrl="https://picsum.photos/200/300"
              description="Industrie & Produktion is a good industry to work in"
              icon="🏥"
              label="Gesundheitswesen"
              value="healthcare"
            />
            <OneSelectionItemCard
              imageUrl="https://picsum.photos/200/300"
              description="Industrie & Produktion is a good industry to work in"
              icon="🏗️"
              label="Bau & Handwerk"
              value="construction"
            />
            <OneSelectionItemCard
              description="Industrie & Produktion is a good industry to work in"
              icon="🚗"
              label="Automobil"
              value="automotive"
            />
            <OneSelectionItemCard
              imageUrl="https://picsum.photos/200/300"
              description="Industrie & Produktion is a good industry to work in"
              icon="🏪"
              label="Handel & Einzelhandel"
              value="retail"
            />
            <OneSelectionItemCard
              imageUrl="https://picsum.photos/200/300"
              description="Industrie & Produktion is a good industry to work in"
              icon="🏢"
              label="Dienstleistungen"
              value="services"
            />
          </OneSelectPage>

          <MultiSelectPage
            header={{
              title: 'Branche',
              description: 'In welcher Branche ist Ihr Unternehmen tätig?',
            }}
            datakey="industry"
          >
            <MultiSelectionItemLine
              icon="🏭"
              label={'Industrie & Produktion'}
              value={'tem'}
            />
            <MultiSelectionItemLine
              icon="🏭"
              label={'Industrie & Produktion'}
              value={'asddf'}
            />
            <MultiSelectionItemLine
              icon="🏭"
              label={'Industrie & Produktion'}
              value={'assssdf'}
            />
            <MultiSelectionItemLine
              icon="🏭"
              label={'Industrie & Produktion'}
              value={'aseeeeeeedf'}
            />
            <MultiSelectionItemLine
              icon="🏭"
              label={'Industrie & Produktion'}
              value={'aswtdf'}
            />
          </MultiSelectPage>

          <MultiSelectPage
            header={{
              title: 'Branche',
              description: 'In welcher Branche ist Ihr Unternehmen tätig?',
            }}
            datakey="industry"
          >
            <MultiSelectionItemLine
              icon="🏭"
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'tem'}
            />
            <MultiSelectionItemLine
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'asddf'}
            />
            <MultiSelectionItemLine
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'assssdf'}
            />
            <MultiSelectionItemLine
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'aseeeeeeedf'}
            />
            <MultiSelectionItemLine
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'aswtdf'}
            />
          </MultiSelectPage>

          <MultiSelectPage
            header={{
              title: 'Branche',
              description: 'In welcher Branche ist Ihr Unternehmen tätig?',
            }}
            datakey="industry"
          >
            <MultiSelectionItemCard
              icon="🏭"
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'tem'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Household & Produktion'}
              value={'temee'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              icon="🏭"
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'tem'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Household & Produktion'}
              value={'temee'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              icon="🏭"
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Industrie & Produktion'}
              value={'tem'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'Household & Produktion'}
              value={'temee'}
              imageUrl={'https://picsum.photos/200/300'}
            />
            <MultiSelectionItemCard
              description={
                'Industrie & Produktion is a good industry to work in'
              }
              label={'test'}
              value={'temedde'}
              icon={<CommandIcon />}
            />
          </MultiSelectPage>

          <UniversalFormPage
            header={{
              title:
                '28 Days Testesterone Boost Challange According to your age',
              description:
                'Seit über 10 Jahren ist der App Store ein sicherer und vertrauenswürdiger Ort, um Apps zu entdecken und zu laden. Aber der App Store ist mehr als ein Schau­fenster.',
            }}
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
    </div>
  );
};

export default App;
