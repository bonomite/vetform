export const petTypes: Array<{}> = [
    { type: 'Dog' },
    { type: 'Cat' },
    { type: 'Rabbit' },
    { type: 'Bird' },
    { type: 'Guinea pig' },
    { type: 'Hamster' },
    { type: 'Chinchillas' },
    { type: 'Rat' },
    { type: 'Hedgehogs' },
    { type: 'Other' },
];

export const sexTypes: Array<{}> = ['Male', 'Female']
export const yesNoTypes: Array<{}> = ['Yes', 'No']

export const petProfileSteps = [
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

export const trackingTypes = ['Microchipped', 'Tattooed']