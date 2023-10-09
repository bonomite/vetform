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
