import { Role } from '@prisma/client';

export const realUsers = [
    // Staff (Receptionist)
    {
        email: 'reception@elitedental.com',
        name: 'Ayesha Khan',
        role: Role.STAFF,
        phone: '+92-300-1234567',
        specialization: 'Receptionist', // Changed from Orthodontics
        qualification: 'BBA', // Changed from BDS
        experience: 3,
        bio: 'Front desk manager and patient coordinator.',
        workingHours: JSON.stringify({
            mon: { start: '12:00', end: '20:00' },
            tue: { start: '12:00', end: '20:00' },
            wed: { start: '12:00', end: '20:00' },
            thu: { start: '12:00', end: '20:00' },
            fri: { start: '12:00', end: '20:00' },
            sat: { start: '12:00', end: '18:00' },
        }),
    },
    // Patients
    {
        email: 'ali.raza@example.com',
        name: 'Mr. Ali Raza',
        role: Role.PATIENT,
        phone: '+92-321-9876543',
        gender: 'Male',
        dob: new Date('1990-05-15'),
        address: 'Bahria Town, Rawalpindi',
    },
    {
        email: 'sara.ahmed@example.com',
        name: 'Ms. Sara Ahmed',
        role: Role.PATIENT,
        phone: '+92-333-5555555',
        gender: 'Female',
        dob: new Date('1995-08-22'),
        address: 'Satellite Town, Rawalpindi',
    },
];
