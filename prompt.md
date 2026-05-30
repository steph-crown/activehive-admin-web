Implement the following

- In /dashboard/gyms/{id} page, in total members card, where it says "~0% vs last period", remove the arrow up and that text and replace with "{count} active members" which is `activeMemberCount` field.
- Also, in the get gym by id endpoint, this is updated response data. Look through the page look through the entire page including all component used, all the diffwerent tabs content included and if there are any hardcoded data that can be taken care of with some field(s) in this response, wire it.

{
"gym": {
"id": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
"name": "S Fitness",
"description": "jsjhsjhs",
"logo": "https://res.cloudinary.com/zarvilla/image/upload/v1775072460/logos/f12441d9-b967-4148-98bc-466c2788cffe/diz4yuoidaxrexju7ihv.png",
"coverImage": null,
"address": {
"city": "Mushin",
"state": "Lagos",
"street": "45 Itire Road",
"country": "Nigeria",
"zipCode": "20002"
},
"phoneNumber": "08090929329",
"email": "ade@mail.com",
"website": "https://djdjd.com",
"businessRegistrationNumber": "83848484848",
"instagram": "instagram.com/ksk",
"facebook": "daksj",
"twitterX": "jjdds",
"operatingHours": null,
"amenities": null,
"facilities": null,
"ownerId": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
"isActive": true,
"createdAt": "2026-04-01T19:52:10.283Z",
"updatedAt": "2026-04-08T19:58:12.439Z",
"owner": {
"id": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
"email": "sfitness@mailinator.com",
"password": "$2b$10$yLJAwSe/c5bDBZWEbo.Oc.UzlqFMG.pRwK3LjPndgygX7CDfPtgb.",
"phoneNumber": null,
"firstName": "Steph",
"lastName": "Crown",
"dateOfBirth": null,
"profileImage": null,
"role": "gym_owner",
"status": "active",
"isEmailVerified": true,
"emailVerificationToken": null,
"emailVerificationOtpExpires": null,
"passwordResetToken": "e8fd1d6638726d9ba27484af840e8e6e39b2d8c7c140edaf375144ba161cbf18",
"passwordResetExpires": "2026-04-22T16:59:32.482Z",
"passwordSetupToken": null,
"passwordSetupExpires": null,
"gymId": null,
"specialties": null,
"specialization": null,
"bio": null,
"isFreelanceTrainer": false,
"address": null,
"currentWeight": null,
"targetWeight": null,
"weightUnit": null,
"medicalCondition": null,
"allergies": null,
"onboardingCompleted": true,
"hasUsedTrialPeriod": true,
"trialUsedAt": "2026-04-01T19:52:10.420Z",
"virtualAccount": null,
"createdAt": "2026-04-01T19:37:01.555Z",
"updatedAt": "2026-04-22T15:59:32.531Z"
},
"trainers": [
{
"id": "e029089d-1a5e-407b-b65f-7f952635af71",
"email": "trainer@example.com",
"password": "",
"phoneNumber": "+1 (555) 123-4567",
"firstName": "John",
"lastName": "Doe",
"dateOfBirth": null,
"profileImage": "https://example.com/trainer-photo.jpg",
"role": "trainer",
"status": "pending",
"isEmailVerified": false,
"emailVerificationToken": null,
"emailVerificationOtpExpires": null,
"passwordResetToken": null,
"passwordResetExpires": null,
"passwordSetupToken": "4d7fc2328a722c9ecb145c5bfc89e4718023d0b864f1b2fba0831cdf535c1628",
"passwordSetupExpires": "2026-04-10T09:21:10.828Z",
"gymId": null,
"specialties": [
"Yoga",
"Strength Training",
"Cardio"
],
"specialization": "",
"bio": "Certified personal trainer with 10 years of experience",
"isFreelanceTrainer": false,
"address": null,
"currentWeight": null,
"targetWeight": null,
"weightUnit": null,
"medicalCondition": null,
"allergies": null,
"onboardingCompleted": false,
"hasUsedTrialPeriod": false,
"trialUsedAt": null,
"virtualAccount": null,
"createdAt": "2026-04-09T08:20:51.806Z",
"updatedAt": "2026-04-11T06:33:19.808Z"
},

        ],
        "approvalStatus": "approved"
    },
    "locations": [
        {
            "id": "cc5548dc-52b6-48b5-9b2a-3b3d23b68dee",
            "gymId": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
            "locationName": "Mushin",
            "address": {
                "city": "Mushin",
                "state": "Lagos",
                "street": "45 Itire Road",
                "country": "Nigeria",
                "zipCode": "20002"
            },
            "phone": "08090929329",
            "email": "ade@mail.com",
            "images": [
                "https://res.cloudinary.com/zarvilla/image/upload/v1775085575/locations/cc5548dc-52b6-48b5-9b2a-3b3d23b68dee/euib4zkvurbolycffk2g.png"
            ],
            "coverImage": "https://res.cloudinary.com/zarvilla/image/upload/v1775085535/locations/cc5548dc-52b6-48b5-9b2a-3b3d23b68dee/cover/vumruxeuksqef7bgu0jg.png",
            "paymentAccount": null,
            "settlementAccount": null,
            "availableBalance": "0.00",
            "pendingBalance": "0.00",
            "totalEarnings": "0.00",
            "totalWithdrawn": "0.00",
            "isHeadquarters": true,
            "isActive": true,
            "operatingHours": [
                {
                    "isOpen": false,
                    "dayOfWeek": 0,
                    "closingTime": "22:00",
                    "openingTime": "06:00"
                },
                {
                    "isOpen": true,
                    "dayOfWeek": 1,
                    "closingTime": "22:00",
                    "openingTime": "06:00"
                },
                {
                    "isOpen": true,
                    "dayOfWeek": 2,
                    "closingTime": "14:30",
                    "openingTime": "06:00"
                },
                {
                    "isOpen": true,
                    "dayOfWeek": 3,
                    "closingTime": "22:00",
                    "openingTime": "06:00"
                },
                {
                    "isOpen": true,
                    "dayOfWeek": 4,
                    "closingTime": "22:00",
                    "openingTime": "06:00"
                },
                {
                    "isOpen": true,
                    "dayOfWeek": 5,
                    "closingTime": "22:00",
                    "openingTime": "06:00"
                },
                {
                    "isOpen": true,
                    "dayOfWeek": 6,
                    "closingTime": "22:00",
                    "openingTime": "06:00"
                }
            ],
            "createdAt": "2026-04-01T20:10:16.097Z",
            "updatedAt": "2026-04-08T20:43:54.723Z"
        },

    ],
    "staffMembers": [
        {
            "id": "d4ce67a0-2899-4731-9973-cfbbdf649a90",
            "userId": "bbb61b12-8f85-4621-a45e-920b01bbdeb5",
            "gymId": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
            "roleId": "f59301b3-d13e-467e-be04-9ba743925d05",
            "department": "Magnam eu non volupt",
            "hireDate": "2009-08-15T00:00:00.000Z",
            "status": "active",
            "createdAt": "2026-04-13T17:57:21.234Z",
            "updatedAt": "2026-04-13T18:04:51.435Z",
            "user": {
                "id": "bbb61b12-8f85-4621-a45e-920b01bbdeb5",
                "email": "qyqebihu@mailinator.com",
                "password": "$2b$10$GMJMWi6kJiWhnF1cJH5TCeE0glSiSOZzFcslhmbsyxFg.4LilXpfG",
                "phoneNumber": "+1 (692) 981-5407",
                "firstName": "Kelly",
                "lastName": "Harrell",
                "dateOfBirth": null,
                "profileImage": null,
                "role": "staff",
                "status": "pending",
                "isEmailVerified": false,
                "emailVerificationToken": null,
                "emailVerificationOtpExpires": null,
                "passwordResetToken": null,
                "passwordResetExpires": null,
                "passwordSetupToken": "ccc5d0a918d897b7faa8dce54478f33a75cebd34b2f84f707f303b1ae2b94381",
                "passwordSetupExpires": "2026-04-14T17:57:20.001Z",
                "gymId": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
                "specialties": null,
                "specialization": null,
                "bio": null,
                "isFreelanceTrainer": false,
                "address": null,
                "currentWeight": null,
                "targetWeight": null,
                "weightUnit": null,
                "medicalCondition": null,
                "allergies": null,
                "onboardingCompleted": false,
                "hasUsedTrialPeriod": false,
                "trialUsedAt": null,
                "virtualAccount": null,
                "createdAt": "2026-04-13T17:57:20.329Z",
                "updatedAt": "2026-04-13T17:57:20.329Z"
            },
            "role": {
                "id": "f59301b3-d13e-467e-be04-9ba743925d05",
                "name": "Member Manager",
                "description": "Staff member with full member management capabilities",
                "code": "member_manager",
                "type": "system_template",
                "createdById": null,
                "gymId": null,
                "createdAt": "2026-04-12T19:50:16.929Z",
                "updatedAt": "2026-04-12T19:50:16.929Z"
            },
            "permissions": [
                {
                    "id": "33cadd0a-9712-431f-900a-2bbc2c125c8e",
                    "name": "View Dashboard",
                    "description": "View Dashboard overview and analytics",
                    "code": "dashboard.view",
                    "type": "system_template",
                    "createdById": null,
                    "gymId": null,
                    "createdAt": "2026-04-12T19:48:56.462Z",
                    "updatedAt": "2026-04-12T19:48:56.462Z"
                },
            ],
            "locations": [
                {
                    "id": "cc5548dc-52b6-48b5-9b2a-3b3d23b68dee",
                    "gymId": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
                    "locationName": "Mushin",
                    "address": {
                        "city": "Mushin",
                        "state": "Lagos",
                        "street": "45 Itire Road",
                        "country": "Nigeria",
                        "zipCode": "20002"
                    },
                    "phone": "08090929329",
                    "email": "ade@mail.com",
                    "images": [
                        "https://res.cloudinary.com/zarvilla/image/upload/v1775085575/locations/cc5548dc-52b6-48b5-9b2a-3b3d23b68dee/euib4zkvurbolycffk2g.png"
                    ],
                    "coverImage": "https://res.cloudinary.com/zarvilla/image/upload/v1775085535/locations/cc5548dc-52b6-48b5-9b2a-3b3d23b68dee/cover/vumruxeuksqef7bgu0jg.png",
                    "paymentAccount": null,
                    "settlementAccount": null,
                    "availableBalance": "0.00",
                    "pendingBalance": "0.00",
                    "totalEarnings": "0.00",
                    "totalWithdrawn": "0.00",
                    "isHeadquarters": true,
                    "isActive": true,
                    "operatingHours": [
                        {
                            "isOpen": false,
                            "dayOfWeek": 0,
                            "closingTime": "22:00",
                            "openingTime": "06:00"
                        },
                        {
                            "isOpen": true,
                            "dayOfWeek": 1,
                            "closingTime": "22:00",
                            "openingTime": "06:00"
                        },
                        {
                            "isOpen": true,
                            "dayOfWeek": 2,
                            "closingTime": "14:30",
                            "openingTime": "06:00"
                        },
                        {
                            "isOpen": true,
                            "dayOfWeek": 3,
                            "closingTime": "22:00",
                            "openingTime": "06:00"
                        },
                        {
                            "isOpen": true,
                            "dayOfWeek": 4,
                            "closingTime": "22:00",
                            "openingTime": "06:00"
                        },
                        {
                            "isOpen": true,
                            "dayOfWeek": 5,
                            "closingTime": "22:00",
                            "openingTime": "06:00"
                        },
                        {
                            "isOpen": true,
                            "dayOfWeek": 6,
                            "closingTime": "22:00",
                            "openingTime": "06:00"
                        }
                    ],
                    "createdAt": "2026-04-01T20:10:16.097Z",
                    "updatedAt": "2026-04-08T20:43:54.723Z"
                }
            ]
        }
    ],
    "memberships": [
        {
            "id": "91f2ce70-057d-4768-a2b1-8ff4b0ae7808",
            "memberId": "12e9e825-7589-4241-a92d-1c570186643e",
            "gymId": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
            "type": "monthly",
            "status": "active",
            "price": "34000.00",
            "startDate": "2026-04-01T00:00:00.000Z",
            "endDate": "2026-05-01T00:00:00.000Z",
            "autoRenew": false,
            "membershipPlanId": "b0c10048-f580-4d11-ab8c-8c18aff78511",
            "locationId": null,
            "createdAt": "2026-04-01T20:30:06.679Z",
            "updatedAt": "2026-04-01T20:30:06.679Z",
            "member": {
                "id": "12e9e825-7589-4241-a92d-1c570186643e",
                "email": "hyhody@mailinator.com",
                "password": "$2b$10$sGlivMJ3r.ZhMTaZkvwgle0Jd6q6FznE9IZLvPndjUQp6z74DtELa",
                "phoneNumber": "09092838383",
                "firstName": "Et porro porro praes",
                "lastName": "Eius velit dolor et",
                "dateOfBirth": "2011-01-22T00:00:00.000Z",
                "profileImage": null,
                "role": "member",
                "status": "pending",
                "isEmailVerified": false,
                "emailVerificationToken": null,
                "emailVerificationOtpExpires": null,
                "passwordResetToken": null,
                "passwordResetExpires": null,
                "passwordSetupToken": "52e03a5dc46c6317d5ff422e4c1d27a9c470fb8f8efd9e57695feeb2c9de7513",
                "passwordSetupExpires": "2026-04-02T20:30:06.273Z",
                "gymId": null,
                "specialties": null,
                "specialization": null,
                "bio": null,
                "isFreelanceTrainer": false,
                "address": null,
                "currentWeight": null,
                "targetWeight": null,
                "weightUnit": null,
                "medicalCondition": null,
                "allergies": null,
                "onboardingCompleted": false,
                "hasUsedTrialPeriod": false,
                "trialUsedAt": null,
                "virtualAccount": null,
                "createdAt": "2026-04-01T20:30:06.553Z",
                "updatedAt": "2026-04-01T20:30:06.553Z"
            }
        },
    ],
    "subscription": {
        "id": "89577001-56d8-40d3-99d8-340642084fbb",
        "gymOwnerId": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
        "trainerId": null,
        "gymId": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
        "platformPlanId": "77a8b18c-6488-4fee-bef7-47a7f5fe86e6",
        "plan": null,
        "status": "active",
        "monthlyPrice": "10000.00",
        "trialStartDate": "2026-04-01T19:52:10.420Z",
        "trialEndDate": "2026-04-08T19:52:10.420Z",
        "subscriptionStartDate": "2026-05-08T19:52:10.420Z",
        "subscriptionEndDate": "2026-06-08T19:52:10.420Z",
        "lastPaymentDate": null,
        "nextPaymentDate": "2026-06-08T19:52:10.420Z",
        "autoRenew": true,
        "cancellationDate": null,
        "cancellationReason": null,
        "subscribedBy": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
        "isTrial": true,
        "gracePeriodDays": null,
        "gracePeriodEndDate": null,
        "actualDeactivationDate": null,
        "createdAt": "2026-04-01T19:52:10.876Z",
        "updatedAt": "2026-04-08T20:12:49.580Z",
        "gymOwner": {
            "id": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
            "email": "sfitness@mailinator.com",
            "password": "$2b$10$yLJAwSe/c5bDBZWEbo.Oc.UzlqFMG.pRwK3LjPndgygX7CDfPtgb.",
            "phoneNumber": null,
            "firstName": "Steph",
            "lastName": "Crown",
            "dateOfBirth": null,
            "profileImage": null,
            "role": "gym_owner",
            "status": "active",
            "isEmailVerified": true,
            "emailVerificationToken": null,
            "emailVerificationOtpExpires": null,
            "passwordResetToken": "e8fd1d6638726d9ba27484af840e8e6e39b2d8c7c140edaf375144ba161cbf18",
            "passwordResetExpires": "2026-04-22T16:59:32.482Z",
            "passwordSetupToken": null,
            "passwordSetupExpires": null,
            "gymId": null,
            "specialties": null,
            "specialization": null,
            "bio": null,
            "isFreelanceTrainer": false,
            "address": null,
            "currentWeight": null,
            "targetWeight": null,
            "weightUnit": null,
            "medicalCondition": null,
            "allergies": null,
            "onboardingCompleted": true,
            "hasUsedTrialPeriod": true,
            "trialUsedAt": "2026-04-01T19:52:10.420Z",
            "virtualAccount": null,
            "createdAt": "2026-04-01T19:37:01.555Z",
            "updatedAt": "2026-04-22T15:59:32.531Z"
        },
        "gym": {
            "id": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
            "name": "S Fitness",
            "description": "jsjhsjhs",
            "logo": "https://res.cloudinary.com/zarvilla/image/upload/v1775072460/logos/f12441d9-b967-4148-98bc-466c2788cffe/diz4yuoidaxrexju7ihv.png",
            "coverImage": null,
            "address": {
                "city": "Mushin",
                "state": "Lagos",
                "street": "45 Itire Road",
                "country": "Nigeria",
                "zipCode": "20002"
            },
            "phoneNumber": "08090929329",
            "email": "ade@mail.com",
            "website": "https://djdjd.com",
            "businessRegistrationNumber": "83848484848",
            "instagram": "instagram.com/ksk",
            "facebook": "daksj",
            "twitterX": "jjdds",
            "operatingHours": null,
            "amenities": null,
            "facilities": null,
            "ownerId": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
            "isActive": true,
            "createdAt": "2026-04-01T19:52:10.283Z",
            "updatedAt": "2026-04-08T19:58:12.439Z"
        }
    },
    "memberCount": 7,
    "activeMemberCount": 4,
    "revenue": "₦47,718,000.00"

}

- Also in the /api/gym/{id}/registration-status response, shown below, look through the entire page including all component used, all the diffwerent tabs content included and see what's to be wired accordingly

{
"gym": {
"id": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
"name": "S Fitness",
"description": "jsjhsjhs",
"logo": "https://res.cloudinary.com/zarvilla/image/upload/v1775072460/logos/f12441d9-b967-4148-98bc-466c2788cffe/diz4yuoidaxrexju7ihv.png",
"coverImage": null,
"address": {
"city": "Mushin",
"state": "Lagos",
"street": "45 Itire Road",
"country": "Nigeria",
"zipCode": "20002"
},
"phoneNumber": "08090929329",
"email": "ade@mail.com",
"website": "https://djdjd.com",
"operatingHours": null,
"amenities": null,
"facilities": null,
"isActive": true,
"createdAt": "2026-04-01T19:52:10.283Z",
"updatedAt": "2026-04-08T19:58:12.439Z"
},
"owner": {
"id": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
"firstName": "Steph",
"lastName": "Crown",
"email": "sfitness@mailinator.com",
"phoneNumber": null,
"status": "active",
"isEmailVerified": true,
"onboardingCompleted": true
},
"registration": {
"status": "approved",
"submittedAt": "2026-03-19T15:35:50.416Z",
"completedAt": "2026-04-01T19:52:11.112Z",
"documents": {
"rcNumber": "9393939393",
"addressProof": "https://res.cloudinary.com/zarvilla/image/upload/v1775072967/documents/f12441d9-b967-4148-98bc-466c2788cffe/address-proof-1775072967685.pdf",
"companyRegNo": "9393939393",
"governmentId": "https://res.cloudinary.com/zarvilla/image/upload/v1775072967/documents/f12441d9-b967-4148-98bc-466c2788cffe/government-id-1775072966842.pdf",
"rcValidation": {
"verified": false
},
"addressProofDate": "2026-04-18"
},
"currentStep": "STEP_6_COMPLETE",
"stepData": {
"1": {
"email": "sfitness@mailinator.com",
"gymName": "S Fitness",
"lastName": "Crown",
"firstName": "Steph"
},
"2": {
"logoPath": "https://res.cloudinary.com/zarvilla/image/upload/v1775072460/logos/f12441d9-b967-4148-98bc-466c2788cffe/diz4yuoidaxrexju7ihv.png",
"primaryColor": "#FF5733",
"secondaryColor": "#1B1C1D"
},
"3": {
"documents": {
"rcNumber": "9393939393",
"addressProof": "https://res.cloudinary.com/zarvilla/image/upload/v1775072967/documents/f12441d9-b967-4148-98bc-466c2788cffe/address-proof-1775072967685.pdf",
"companyRegNo": "9393939393",
"governmentId": "https://res.cloudinary.com/zarvilla/image/upload/v1775072967/documents/f12441d9-b967-4148-98bc-466c2788cffe/government-id-1775072966842.pdf",
"rcValidation": {
"verified": false
},
"addressProofDate": "2026-04-18"
},
"validations": {
"rcNumber": {
"verified": false
},
"addressProof": {
"verified": false
},
"governmentId": {
"verified": false
}
},
"addressProofDate": "2026-04-18"
},
"4": {
"locations": [
{
"city": "Mushin",
"email": "ade@mail.com",
"phone": "08090929329",
"state": "Lagos",
"address": "45 Itire Road",
"country": "Nigeria",
"zipCode": "20002",
"coverImage": "https://res.cloudinary.com/zarvilla/raw/upload/v1775073127/location-cover-images/location-cover-1775073127707",
"locationName": "Mushin",
"isHeadquarters": true
}
],
"hasMultipleLocations": false
},
"5": {
"paymentAccounts": [
{
"bankCode": "test-bank",
"bankName": "Test Bank",
"metadata": {
"active": true,
"bankId": 24,
"assigned": true,
"currency": "NGN"
},
"provider": "paystack",
"accountName": "TEST-MANAGED-ACCOUNT",
"accountNumber": "1238156678",
"providerAccountId": "10275083",
"locationIdentifier": "0",
"providerCustomerId": "351906789"
}
]
},
"6": {
"gymId": "5a92bcc1-7880-41d0-81a6-9c5b55f24181",
"userId": "ee0772b2-2fc7-4875-8293-1308c45e98a7",
"completed": true,
"approvalId": "d1fe6be4-7770-4d7d-a89f-9f27b574eb38",
"subscriptionId": "89577001-56d8-40d3-99d8-340642084fbb"
}
},
"isApproved": true,
"rejectionReason": null,
"adminComments": null,
"canResubmit": false,
"approvalDetails": {
"id": "d1fe6be4-7770-4d7d-a89f-9f27b574eb38",
"status": "approved",
"currentStep": "final",
"stepApprovals": {
"documents": {
"status": "pending"
},
"locations": {
"status": "pending"
},
"paymentAccounts": {
"status": "pending"
}
},
"reviewedAt": "2026-04-01T20:10:15.481Z",
"reviewedBy": {
"id": "1517bdf6-ac26-43b6-90ae-4f4d29ca1a23",
"firstName": "Platform",
"lastName": "Administrator",
"email": "admin@activehive.com"
}
},
"subscriptionStatus": {
"hasSubscription": true,
"isExpired": false,
"status": "active",
"trialEndDate": "2026-04-08T19:52:10.420Z",
"subscriptionEndDate": "2026-06-08T19:52:10.420Z"
}
},
"stats": {
"totalMembers": 7,
"totalTrainers": 4,
"totalLocations": 3,
"activeMemberships": 4,
"totalClasses": 0,
"checkInsToday": 2
}
}
