export const LOCAL_STORAGE_NAME: String = 'myPetProfileFormData'


export const FOOD_ENTRY_OBJECT = () => ({ id: randomId(), product: '', times_a_day: 1 })

export const PREVENTATIVE_ENTRY_OBJECT = (label) => ({ id: randomId(), product: label, date: null, checked: false, other: null })

export const MEDS_ENTRY_OBJECT = () => ({ id: randomId(), product: '', times_a_day: 1, dose: '' })

export const PETOPTIONS: Array<{}> = [
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

export const LIFESTYLES: Array<{}> = [
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
export const PREVENTATIVES: Array<{}> = [
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
export const INSURANCEPROVIDERS: Array<{}> = [
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

export const SEXOPTIONS: Array<{}> = ['Male', 'Female']
export const NOYESOPTIONS: Array<{}> = ['Yes', 'No']
export const TRACKING_OPTIONS: Array<{}> = ['Microchipped', 'Tattooed']
export const PET_AQUIRED_FROM_OPTIONS: Array<{}> = ['Breeder', 'Shelter / Rescue', 'Store', 'Private home', 'Stray', 'Other']
export const PET_PROFILE_STEPS: Array<{}> = [
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

export const PET_OBJECT_MODEL = {
    name: null,
    type: null,
    sex: null,
    spayed_neutered: null,
    dob: null,
    tracking: null,
    lifestyles: null,
    lifestyles_other: null,
    household_less_than_6_months: null,
    pet_aquired_from: null,
    describe_housing: null,
    food: [FOOD_ENTRY_OBJECT()],
    grain_free: null,
    preventatives: null,
    preventatives_other: null,
    meds: [],
    has_insurance: null,
    provider: null,
    provider_other: null,
    other_hospitals: null,
    other_hospital_name: null,
    other_hospital_visit: null,
}

