import { Performance, Short, Booking, Subscriber } from './types';

export const INITIAL_PERFORMANCES: Performance[] = [
  {
    id: '1',
    title: 'Gar Tum Bhula Na Doge',
    genre: 'Romantic',
    year: '2024',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    views: '124k',
    duration: '4:32'
  },
  {
    id: '2',
    title: 'Door Door Tum Rahe Pukarte Hum Rahe',
    genre: 'Classic Bollywood',
    year: '2023',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2lR2aTyJVEQO0wi9-FmQgvC8EOiHsm5He9pBsGwRsHFA01v8SokbtxVYvEiPOUhLnFl-e0_JL5xEgXvRQ2LFWH2zGPW1zWF-Jd0GIG8QedZfIgAstNLpZ2jSpVHHAdVg_vbgKVb3WLUG92rOeMkY1A19QSeDiacuAwQuwwAxSFoLtDW75PWtLFrRMUpYh9LRzguycdIHeJlkQQNeDm2utdqUo74gIL_qF5m3TgZr9eNl9VgszWARnN_5LP77m3fLGoyBewqJ55To',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    views: '95k',
    duration: '5:30'
  },
  {
    id: '3',
    title: 'Aajkal Yaad Kuch Aur Rehta Nahi',
    genre: 'Romantic',
    year: '2024',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVpn0xXm0Y-fzIL-npSERabYqeKIB-8wDv3n-N19PaV2ffJmd6Begf3eqE2Aus0sM9L1mYz8ydlo2cMRBklsJYG8lqLWrUmq2tjCL1_mv50lfdl0RvQHS68zfCe2-V6PNVI06RH5FyJa8zEz-0aOl4AvYcXD8wc-3Re7AVujkJ5ndCZBams_OPhR_VaGZH5REjcTyz5P5dT-piiHnbRLJt8TuCsdUjhKPild00HTUd3ssf6_--b_jQCUdDvKW8Gxmm2UUtgquiBQ',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    views: '110k',
    duration: '3:48'
  },
  {
    id: '4',
    title: 'Ruk Jaana Nahin',
    genre: 'Inspirational',
    year: '2024',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    views: '87k',
    duration: '4:15'
  },
  {
    id: '5',
    title: 'Har Karm Apna Karenge',
    genre: 'Patriotic',
    year: '2024',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    views: '142k',
    duration: '5:04'
  },
  {
    id: '6',
    title: 'Aapko Pehle Bhi Kahin Dekha Hai',
    genre: 'Playful',
    year: '2023',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    views: '76k',
    duration: '3:10'
  },
  {
    id: '7',
    title: 'Zindagi Ban Gaye Ho Tum',
    genre: 'Romantic',
    year: '2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    views: '98k',
    duration: '4:40'
  }
];

export const INITIAL_SHORTS: Short[] = [
  {
    id: 's1',
    title: 'shokh nazar ki bijliyan',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUq0t8Mw4VrWf74iiBX9GjmSUgEsGZefdDySTtxjcShPLUnR6vi0pVw-e5gZW6T7Dz5kTOXne2vrNPJW7DT4BJvZGfl-AIpFla9pJQAwieQF710oP93h67enCshPju1v679copz25uoFeDYJo_mhmbIldyT_L3TNsJCn7zl-pm0UzyHfgwYeO_NPf_a89kNIBL8qcPNRuO2Hxk9Q580nrZjDTDxxxsDKKtrh-1YDSGK63hHVM3cVSpN1fWOz9RqOAZenOWtUlPv2Y',
    views: '45K'
  },
  {
    id: 's2',
    title: 'Vocal Warmup Session',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlceoHKYJHtWkOkO5pRfgo5Hq_H4V4pnPt5sBN3pp4FRbG6bXZyjl_fwvddxYDBA0sowNReZdLoQNgxrbUVPZVHqEjtwNVq7GgbjOdmZYhwxPW6iytYj5aRWu4RKYtC9O08273RBNIYkfOF6GpZs3Wrx9lK1cKiiIXvH04sR6hTIW-EgPRk0qgrimdsfhjrTi_HTANwXPbW_hSmceY3PG02B605Td8OR4Xg2zMCxcV4dyta8PdtGzSnmSZJdnEl1PqkYTo-HHxeUk',
    views: '32K'
  },
  {
    id: 's3',
    title: 'Unplugged Classics',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHts-HNCzmeai0rc3BcC49AcnV7F4Jnj1Wj7c0IIZmwGhVSGjg3f1r9RD_fJSXK9-NuKkOk1aDEBEm6BnMpVy234uZVyicDqZwijeCTYqDM_k0t-oSmnSIEnqxdEZGJ3RpujixSqRwfUIUBRDVa58aVnrjbT4IQYbQexwi-9YcKE1cNdOgOHPq3mFTXiCOhcjnJbO0rMr2E22Nhs7rPvEk9oW8Gap1-k7y6Ja2kODoak5ZIRy8M3FyX1tyMRdqxF-aRI4eMD-J4UA',
    views: '18K'
  },
  {
    id: 's4',
    title: 'Live in Mumbai',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfM8S4oqmnr_JUIjlvorztZ9PM45R78pKEKLl9a3XWfc2CYNOL_YKlUNc6Op5sYeQ3jeTcUHgm8kyD5ycDe4Fk7Fdd-YZ7Gqxhd-Lyjv6LL89EpQwKdyIAKw2rXWhsJoYlVYMLNFwom-7J-ctkkxkJKS3yZ9tFji1M-r9r88t90cCGmdd3ugXRuUhbju3rB9elUn-WCGhFj4p_ykiCmNgfK_0CFFpp580HKokjBL17MiubgSsVKeanMC9GGNFz6Whbxv92An0Vp2Y',
    views: '58K'
  },
  {
    id: 's5',
    title: 'Musical Crafts',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPIBGi-VH3NuXEeIXcBnWgvzRkr8a9bNCslujwfdKzAuTf5JZ150QDAIk0RsDDSoC467r4GOF2jPtHv8MNv0YQPcbQkGa7tMMYOlO1qmcYnuToYx_a3IytEA9SPHuDVCH7guIzWSvS2fU-28W69oRHBssuZ_JKAri8sF1GxuoWtAmxBiKZGVu1LQl4kYWr_3LHwDz4YQkwBm2nHIgG7KGLJVY-rfkAxA_vi_M9Q2uZftkLF4ssifQ_nHFjukfqoBsJ3_wKAjS_GqI',
    views: '29K'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    clientName: 'Sanjay Deshmukh',
    clientEmail: 'sanjay@example.com',
    clientPhone: '+91 98765 43210',
    eventDate: '2026-09-15',
    eventType: 'Ghazal Mehfil',
    venue: 'Royal Opera House, Mumbai',
    message: 'We would love to book Jyoti for a 2-hour classic ghazal set.',
    status: 'Pending',
    createdAt: '2026-06-20T10:00:00Z'
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub1',
    email: 'classical.fan@gmail.com',
    subscribedAt: '2026-06-21T18:30:00Z'
  }
];
