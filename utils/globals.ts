export const localStorageName: String = 'myPetProfileFormData'

export const petOptions: Array<{}> = [
    { label: 'Dog', exotic: false },
    { label: 'Cat', exotic: false },
    { label: 'Rabbit', exotic: true },
    { label: 'Bird', exotic: true },
    { label: 'Guinea pig', exotic: true },
    { label: 'Hamster', exotic: true },
    { label: 'Chinchillas', exotic: true },
    { label: 'Rat', exotic: true },
    { label: 'Hedgehogs', exotic: true },
    { label: 'Other', exotic: true },
];

export const lifestyles: Array<{}> = [
    { label: 'Boarding' },
    { label: 'Grooming' },
    { label: 'Daycare' },
    { label: 'Dog Park' },
    { label: 'Hiking' },
    { label: 'Hunting' },
    { label: 'Travel' },
    { label: 'Backyard' },
    { label: 'Neighborhoos walks' },
    { label: 'Doggy play dates' },
    { label: 'Other' },
];
export const preventatives: Array<{}> = [
    { label: 'Trio' },
    { label: 'Sentinel' },
    { label: 'Heartgard' },
    { label: 'Revolution' },
    { label: 'Frontline' },
    { label: 'Bravecto' },
    { label: 'Nexgard' },
    { label: 'Credelio' },
    { label: 'Trifexis' },
    { label: 'Seresto Collar' },
    { label: 'Interceptop' },
    { label: 'Advantage' },
    { label: 'Advantage Multi' },
    { label: 'Other' },
];
export const insuranceProviders: Array<{}> = [
    { label: 'Don\'t know' },
    { label: 'Trupanion' },
    { label: 'PetPartners, Inc.' },
    { label: 'Embrace' },
    { label: 'Figo' },
    { label: 'Healthy Paws' },
    { label: 'Nationwide' },
    { label: 'Pets Best' },
    { label: 'Fetch' },
    { label: 'PetFirst' },
    { label: 'Petplan' },
    { label: 'Nationwide' },
    { label: 'Pet Assure Corp' },
    { label: 'Petco' },
    { label: 'Healthy Paws' },
    { label: 'TrustedPals' },
    { label: 'USAA' },
    { label: 'GEICO' },
    { label: 'Progressive' },
    { label: 'Wagmo' },
    { label: 'MetLife' },
    { label: 'Chewy' },
    { label: 'Banfield' },
    { label: 'Hartville Group' },
    { label: 'Other' },
];

export const sexOptions: Array<{}> = ['Male', 'Female']
export const yesNoOptions: Array<{}> = ['Yes', 'No']
export const trackingOptions: Array<{}> = ['Microchipped', 'Tattooed']
export const petAquiredFromOptions: Array<{}> = ['Breeder', 'Shelter / Rescue', 'Store', 'Private home', 'Stray', 'Other']
export const petProfileSteps: Array<{}> = [
    {
        index: 0,
        label: 'Basics',
        route: '/pet-profile',
    },
    {
        index: 1,
        label: 'Lifestyle',
        route: '/pet-profile-lifestyle',
    },
    {
        index: 2,
        label: 'Rx/Preventatives',
        route: '/pet-profile-rx',
    },
    {
        index: 3,
        label: 'Insurance',
        route: '/pet-profile-insurance',
    },
]

export const randomId = function (length = 6) {
    return Math.random().toString(36).substring(2, length + 2);
};

export const foodEntryObject = () => ({ product: '', times_a_day: 1 })

export const preventativeEntryObject = (label) => ({ product: label, date: null, checked: false, other: null })

export const medsEntryObject = () => ({ product: '', times_a_day: 1, dose: '' })