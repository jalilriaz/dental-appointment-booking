require('dotenv').config({ path: __dirname + '/../.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

// ─── 120 Authentic Clinical Patient Profiles ───
const PATIENT_PROFILES = [
  // 1-10
  { name: "Hamza Tariq", phone: "+92-300-1122334", email: "hamza.tariq@gmail.com", gender: "Male", dob: "1992-04-15", address: "Sector G-8/2, Islamabad", alert: "Penicillin allergy - use Clindamycin" },
  { name: "Zainab Bibi", phone: "+92-301-2233445", email: "zainab.bibi@yahoo.com", gender: "Female", dob: "1988-11-20", address: "G-11/3, Islamabad", alert: null },
  { name: "Bilal Butt", phone: "+92-302-3344556", email: "bilal.butt@hotmail.com", gender: "Male", dob: "1995-07-08", address: "Bahria Town Phase 4, Rawalpindi", alert: "Hypertensive (on Amlodipine 5mg)" },
  { name: "Ayesha Farooq", phone: "+92-303-4455667", email: "ayesha.f@gmail.com", gender: "Female", dob: "2001-02-14", address: "DHA Phase 2, Islamabad", alert: null },
  { name: "Usman Javed", phone: "+92-304-5566778", email: "usman.javed@outlook.com", gender: "Male", dob: "1984-09-30", address: "Sector E-11/1, Islamabad", alert: "Type 2 Diabetic (HbA1c 6.8)" },
  { name: "Sana Mir", phone: "+92-305-6677889", email: "sana.mir@gmail.com", gender: "Female", dob: "1997-05-18", address: "Saddar, Rawalpindi", alert: null },
  { name: "Daniyal Qureshi", phone: "+92-306-7788990", email: "daniyal.q@gmail.com", gender: "Male", dob: "1990-12-05", address: "F-8/4, Islamabad", alert: "Asthmatic - carries Salbutamol inhaler" },
  { name: "Mahnoor Shah", phone: "+92-307-8899001", email: "mahnoor.shah@yahoo.com", gender: "Female", dob: "1999-03-25", address: "Chaklala Scheme 3, Rawalpindi", alert: null },
  { name: "Omer Farooq", phone: "+92-308-9900112", email: "omer.farooq@gmail.com", gender: "Male", dob: "1981-06-12", address: "Sector I-8/2, Islamabad", alert: null },
  { name: "Rabia Basri", phone: "+92-309-0011223", email: "rabia.basri@hotmail.com", gender: "Female", dob: "1976-10-09", address: "Westridge 1, Rawalpindi", alert: "Mild cardiac arrhythmia" },

  // 11-20
  { name: "Mustafa Kamal", phone: "+92-310-1234567", email: "mustafa.k@gmail.com", gender: "Male", dob: "1993-08-22", address: "Sector F-11/3, Islamabad", alert: null },
  { name: "Iqra Aziz", phone: "+92-311-2345678", email: "iqra.aziz@outlook.com", gender: "Female", dob: "2002-01-19", address: "Askari 14, Rawalpindi", alert: null },
  { name: "Haris Rauf", phone: "+92-312-3456789", email: "haris.rauf@gmail.com", gender: "Male", dob: "1994-11-07", address: "Sector G-9/1, Islamabad", alert: "Latex sensitivity" },
  { name: "Maryam Nawazish", phone: "+92-313-4567890", email: "maryam.nawazish@gmail.com", gender: "Female", dob: "1987-04-03", address: "Satellite Town, Rawalpindi", alert: null },
  { name: "Shahbaz Ahmed", phone: "+92-314-5678901", email: "shahbaz.ahmed@yahoo.com", gender: "Male", dob: "1980-08-16", address: "Sector F-7/2, Islamabad", alert: "Diabetic - requires morning appointments" },
  { name: "Arham Khan", phone: "+92-315-6789012", email: "arham.khan@gmail.com", gender: "Male", dob: "2000-09-11", address: "Bahria Phase 7, Rawalpindi", alert: null },
  { name: "Hira Mani", phone: "+92-316-7890123", email: "hira.mani@gmail.com", gender: "Female", dob: "1996-12-28", address: "Sector G-13/4, Islamabad", alert: null },
  { name: "Rehan Chaudhry", phone: "+92-317-8901234", email: "rehan.c@outlook.com", gender: "Male", dob: "1979-05-14", address: "Sector B-17, Islamabad", alert: "Aspirin blood thinner therapy" },
  { name: "Anum Fayyaz", phone: "+92-318-9012345", email: "anum.fayyaz@gmail.com", gender: "Female", dob: "1998-07-21", address: "Media Town, Rawalpindi", alert: null },
  { name: "Zeeshan Siddiqui", phone: "+92-319-0123456", email: "zeeshan.s@gmail.com", gender: "Male", dob: "1991-03-09", address: "Sector I-10/1, Islamabad", alert: null },

  // 21-30
  { name: "Khadija Aslam", phone: "+92-320-1122335", email: "khadija.aslam@yahoo.com", gender: "Female", dob: "1983-10-17", address: "PWD Housing Society, Islamabad", alert: null },
  { name: "Fahad Mustafa", phone: "+92-321-2233446", email: "fahad.mustafa@gmail.com", gender: "Male", dob: "1986-06-26", address: "Sector F-6/1, Islamabad", alert: "Gag reflex sensitivity" },
  { name: "Nida Yasir", phone: "+92-322-3344557", email: "nida.yasir@hotmail.com", gender: "Female", dob: "1978-02-11", address: "Gulberg Greens, Islamabad", alert: null },
  { name: "Babar Azam", phone: "+92-323-4455668", email: "babar.azam@gmail.com", gender: "Male", dob: "1994-10-15", address: "DHA Phase 1, Rawalpindi", alert: null },
  { name: "Sajal Aly", phone: "+92-324-5566779", email: "sajal.aly@gmail.com", gender: "Female", dob: "1994-01-17", address: "Sector E-7, Islamabad", alert: null },
  { name: "Imran Abbas", phone: "+92-325-6677880", email: "imran.abbas@outlook.com", gender: "Male", dob: "1982-10-15", address: "Bahria Phase 8, Rawalpindi", alert: "Dental phobia - needs gentle pacing" },
  { name: "Mehwish Hayat", phone: "+92-326-7788991", email: "mehwish.h@yahoo.com", gender: "Female", dob: "1990-01-06", address: "Sector G-10/2, Islamabad", alert: null },
  { name: "Ahsan Khan", phone: "+92-327-8899002", email: "ahsan.khan@gmail.com", gender: "Male", dob: "1985-11-23", address: "Sector G-8 Markaz, Islamabad", alert: null },
  { name: "Yumna Zaidi", phone: "+92-328-9900113", email: "yumna.zaidi@gmail.com", gender: "Female", dob: "1993-07-30", address: "Sector H-13, Islamabad", alert: null },
  { name: "Waqas Shafi", phone: "+92-329-0011224", email: "waqas.shafi@gmail.com", gender: "Male", dob: "1989-04-12", address: "Westridge 3, Rawalpindi", alert: null },

  // 31-40
  { name: "Tariq Jamil", phone: "+92-330-1122336", email: "tariq.jamil@gmail.com", gender: "Male", dob: "1965-03-12", address: "Sector F-8/1, Islamabad", alert: "Cardiac pacemaker in situ" },
  { name: "Bushra Ansari", phone: "+92-331-2233447", email: "bushra.ansari@gmail.com", gender: "Female", dob: "1974-06-25", address: "Sector F-11/2, Islamabad", alert: null },
  { name: "Asim Azhar", phone: "+92-332-3344558", email: "asim.azhar@outlook.com", gender: "Male", dob: "1996-10-29", address: "DHA Phase 1, Islamabad", alert: null },
  { name: "Momina Mustehsan", phone: "+92-333-4455669", email: "momina.m@gmail.com", gender: "Female", dob: "1992-09-05", address: "Sector E-7, Islamabad", alert: "Sulfa drug allergy" },
  { name: "Atif Aslam", phone: "+92-334-5566770", email: "atif.aslam@yahoo.com", gender: "Male", dob: "1983-03-12", address: "Bahria Town Phase 6, Rawalpindi", alert: null },
  { name: "Sanam Saeed", phone: "+92-335-6677881", email: "sanam.saeed@gmail.com", gender: "Female", dob: "1985-02-02", address: "Sector F-6/3, Islamabad", alert: null },
  { name: "Fawad Khan", phone: "+92-336-7788992", email: "fawad.khan@gmail.com", gender: "Male", dob: "1981-11-29", address: "Sector F-7/4, Islamabad", alert: "Type 1 Diabetic (Insulin dependent)" },
  { name: "Mahira Khan", phone: "+92-337-8899003", email: "mahira.k@yahoo.com", gender: "Female", dob: "1984-12-21", address: "Sector G-8/4, Islamabad", alert: null },
  { name: "Humayun Saeed", phone: "+92-338-9900114", email: "humayun.s@gmail.com", gender: "Male", dob: "1971-07-27", address: "G-10/4, Islamabad", alert: "Hypertension on ACE inhibitor" },
  { name: "Ayeza Khan", phone: "+92-339-0011225", email: "ayeza.khan@hotmail.com", gender: "Female", dob: "1991-01-15", address: "Sector G-11/1, Islamabad", alert: null },

  // 41-50
  { name: "Danish Taimoor", phone: "+92-340-1234568", email: "danish.t@gmail.com", gender: "Male", dob: "1983-02-16", address: "Sector G-13/2, Islamabad", alert: null },
  { name: "Kinza Hashmi", phone: "+92-341-2345679", email: "kinza.h@outlook.com", gender: "Female", dob: "1997-03-07", address: "Bahria Phase 3, Rawalpindi", alert: null },
  { name: "Feroze Khan", phone: "+92-342-3456780", email: "feroze.k@gmail.com", gender: "Male", dob: "1990-07-11", address: "Westridge 2, Rawalpindi", alert: "Asthma - mild exercise induced" },
  { name: "Sarah Khan", phone: "+92-343-4567891", email: "sarah.khan@gmail.com", gender: "Female", dob: "1992-07-14", address: "Sector I-8/3, Islamabad", alert: null },
  { name: "Falak Shabir", phone: "+92-344-5678902", email: "falak.s@yahoo.com", gender: "Male", dob: "1985-12-27", address: "Sector I-9/4, Islamabad", alert: null },
  { name: "Sonya Hussyn", phone: "+92-345-6789013", email: "sonya.h@gmail.com", gender: "Female", dob: "1991-07-15", address: "Sector F-8/2, Islamabad", alert: null },
  { name: "Bilal Abbas", phone: "+92-346-7890124", email: "bilal.abbas@gmail.com", gender: "Male", dob: "1993-06-04", address: "Sector G-9/3, Islamabad", alert: null },
  { name: "Ramsha Khan", phone: "+92-347-8901235", email: "ramsha.k@outlook.com", gender: "Female", dob: "1994-06-23", address: "Media Town, Rawalpindi", alert: null },
  { name: "Ahad Raza Mir", phone: "+92-348-9012346", email: "ahad.mir@gmail.com", gender: "Male", dob: "1993-09-29", address: "DHA Phase 2, Islamabad", alert: null },
  { name: "Yumna Khan", phone: "+92-349-0123457", email: "yumna.khan@gmail.com", gender: "Female", dob: "1996-08-14", address: "Bahria Phase 5, Rawalpindi", alert: "Erythromycin allergy" },

  // 51-60
  { name: "Sheheryar Munawar", phone: "+92-350-1122336", email: "sheheryar.m@yahoo.com", gender: "Male", dob: "1988-08-09", address: "Sector F-7/1, Islamabad", alert: null },
  { name: "Maya Ali", phone: "+92-351-2233447", email: "maya.ali@gmail.com", gender: "Female", dob: "1989-07-27", address: "Sector F-11/4, Islamabad", alert: null },
  { name: "Wahaj Ali", phone: "+92-352-3344558", email: "wahaj.ali@hotmail.com", gender: "Male", dob: "1988-12-01", address: "Sector G-10/3, Islamabad", alert: "Mild dental anxiety" },
  { name: "Hania Aamir", phone: "+92-353-4455669", email: "hania.aamir@gmail.com", gender: "Female", dob: "1997-02-12", address: "Sector E-11/2, Islamabad", alert: null },
  { name: "Farhan Saeed", phone: "+92-354-5566770", email: "farhan.saeed@gmail.com", gender: "Male", dob: "1984-09-14", address: "Sector G-11/4, Islamabad", alert: null },
  { name: "Urwa Hocane", phone: "+92-355-6677881", email: "urwa.h@outlook.com", gender: "Female", dob: "1991-07-02", address: "Sector F-6/2, Islamabad", alert: null },
  { name: "Mawra Hocane", phone: "+92-356-7788992", email: "mawra.h@gmail.com", gender: "Female", dob: "1992-09-28", address: "Sector F-6/2, Islamabad", alert: null },
  { name: "Imran Ashraf", phone: "+92-357-8899003", email: "imran.ashraf@gmail.com", gender: "Male", dob: "1989-09-11", address: "Sector I-8/1, Islamabad", alert: null },
  { name: "Saba Qamar", phone: "+92-358-9900114", email: "saba.qamar@yahoo.com", gender: "Female", dob: "1984-04-05", address: "Sector F-8/3, Islamabad", alert: "Codeine allergy" },
  { name: "Zahid Ahmed", phone: "+92-359-0011225", email: "zahid.ahmed@gmail.com", gender: "Male", dob: "1984-09-20", address: "Satellite Town, Rawalpindi", alert: null },

  // 61-73
  { name: "Sanam Baloch", phone: "+92-360-1234569", email: "sanam.baloch@gmail.com", gender: "Female", dob: "1986-07-14", address: "Bahria Phase 1, Rawalpindi", alert: null },
  { name: "Mikaal Zulfiqar", phone: "+92-361-2345670", email: "mikaal.z@gmail.com", gender: "Male", dob: "1981-09-05", address: "Sector G-8/1, Islamabad", alert: null },
  { name: "Syra Yousuf", phone: "+92-362-3456781", email: "syra.yousuf@outlook.com", gender: "Female", dob: "1988-04-20", address: "Sector F-7/3, Islamabad", alert: null },
  { name: "Shehzad Roy", phone: "+92-363-4567892", email: "shehzad.roy@gmail.com", gender: "Male", dob: "1977-02-16", address: "DHA Phase 3, Islamabad", alert: "Penicillin allergy" },
  { name: "Hadiqa Kiani", phone: "+92-364-5678903", email: "hadiqa.k@yahoo.com", gender: "Female", dob: "1974-08-11", address: "Sector E-7, Islamabad", alert: null },
  { name: "Ali Zafar", phone: "+92-365-6789014", email: "ali.zafar@gmail.com", gender: "Male", dob: "1980-05-18", address: "Sector F-8/4, Islamabad", alert: null },
  { name: "Aima Baig", phone: "+92-366-7890125", email: "aima.baig@gmail.com", gender: "Female", dob: "1995-03-10", address: "Bahria Phase 4, Rawalpindi", alert: null },
  { name: "Asad Siddiqui", phone: "+92-367-8901236", email: "asad.s@gmail.com", gender: "Male", dob: "1987-04-15", address: "Sector G-13/1, Islamabad", alert: null },
  { name: "Zara Noor Abbas", phone: "+92-368-9012347", email: "zara.noor@outlook.com", gender: "Female", dob: "1991-03-13", address: "Sector G-10/1, Islamabad", alert: null },
  { name: "Osman Khalid Butt", phone: "+92-369-0123458", email: "osman.kb@gmail.com", gender: "Male", dob: "1986-02-09", address: "Sector F-11/1, Islamabad", alert: null },
  { name: "Neelam Muneer", phone: "+92-370-1122337", email: "neelam.m@yahoo.com", gender: "Female", dob: "1992-03-20", address: "Sector I-10/2, Islamabad", alert: null },
  { name: "Muneeb Butt", phone: "+92-371-2233448", email: "muneeb.butt@gmail.com", gender: "Male", dob: "1992-04-14", address: "Sector G-11/2, Islamabad", alert: null },
  { name: "Aiman Khan", phone: "+92-372-3344559", email: "aiman.khan@gmail.com", gender: "Female", dob: "1998-11-20", address: "DHA Phase 1, Islamabad", alert: null },

  // 74-85 (New Patients)
  { name: "Shaan Shahid", phone: "+92-373-4455660", email: "shaan.shahid@gmail.com", gender: "Male", dob: "1971-04-27", address: "Sector E-7, Islamabad", alert: null },
  { name: "Meera Irtiza", phone: "+92-374-5566771", email: "meera.irtiza@yahoo.com", gender: "Female", dob: "1977-05-12", address: "Sector F-8/1, Islamabad", alert: "Local anesthetic sensitivity" },
  { name: "Resham Begum", phone: "+92-375-6677882", email: "resham.actress@gmail.com", gender: "Female", dob: "1978-10-22", address: "Sector F-6/4, Islamabad", alert: null },
  { name: "Javed Sheikh", phone: "+92-376-7788993", email: "javed.sheikh@gmail.com", gender: "Male", dob: "1954-10-08", address: "Sector F-7/1, Islamabad", alert: "Hypertensive - on Losartan 50mg" },
  { name: "Behroze Sabzwari", phone: "+92-377-8899004", email: "behroze.s@gmail.com", gender: "Male", dob: "1957-02-16", address: "DHA Phase 2, Islamabad", alert: null },
  { name: "Shahroz Sabzwari", phone: "+92-378-9900115", email: "shahroz.s@outlook.com", gender: "Male", dob: "1985-08-25", address: "Bahria Phase 7, Rawalpindi", alert: null },
  { name: "Sadaf Kanwal", phone: "+92-379-0011226", email: "sadaf.kanwal@gmail.com", gender: "Female", dob: "1993-08-29", address: "Sector G-11/3, Islamabad", alert: null },
  { name: "Ali Rehman Khan", phone: "+92-380-1122338", email: "ali.rehman@gmail.com", gender: "Male", dob: "1988-05-06", address: "Sector G-8/3, Islamabad", alert: null },
  { name: "Hareem Farooq", phone: "+92-381-2233449", email: "hareem.f@gmail.com", gender: "Female", dob: "1989-05-26", address: "Sector F-8/4, Islamabad", alert: null },
  { name: "Usman Mukhtar", phone: "+92-382-3344550", email: "usman.mukhtar@yahoo.com", gender: "Male", dob: "1985-07-27", address: "Sector G-10/4, Islamabad", alert: null },
  { name: "Kubra Khan", phone: "+92-383-4455661", email: "kubra.khan@gmail.com", gender: "Female", dob: "1993-06-16", address: "Sector E-11/3, Islamabad", alert: null },
  { name: "Gohar Rasheed", phone: "+92-384-5566772", email: "gohar.r@gmail.com", gender: "Male", dob: "1984-05-02", address: "Sector G-13/3, Islamabad", alert: null },

  // 86-95
  { name: "Mansha Pasha", phone: "+92-385-6677883", email: "mansha.pasha@outlook.com", gender: "Female", dob: "1987-10-19", address: "Sector I-8/4, Islamabad", alert: null },
  { name: "Jibran Nasir", phone: "+92-386-7788994", email: "jibran.nasir@gmail.com", gender: "Male", dob: "1987-02-10", address: "Sector F-6/1, Islamabad", alert: null },
  { name: "Sanam Jung", phone: "+92-387-8899005", email: "sanam.jung@gmail.com", gender: "Female", dob: "1988-09-30", address: "Sector F-11/2, Islamabad", alert: null },
  { name: "Mikaal Hasan", phone: "+92-388-9900116", email: "mikaal.hasan@gmail.com", gender: "Male", dob: "1976-12-19", address: "Media Town, Rawalpindi", alert: null },
  { name: "Natasha Baig", phone: "+92-389-0011227", email: "natasha.baig@yahoo.com", gender: "Female", dob: "1992-01-02", address: "Chaklala Scheme 3, Rawalpindi", alert: null },
  { name: "Ali Sethi", phone: "+92-390-1234560", email: "ali.sethi@gmail.com", gender: "Male", dob: "1984-07-02", address: "Sector F-7/3, Islamabad", alert: null },
  { name: "Shae Gill", phone: "+92-391-2345671", email: "shae.gill@gmail.com", gender: "Female", dob: "1999-04-23", address: "Bahria Phase 8, Rawalpindi", alert: null },
  { name: "Bilal Saeed", phone: "+92-392-3456782", email: "bilal.saeed@outlook.com", gender: "Male", dob: "1989-12-12", address: "Sector G-9/2, Islamabad", alert: null },
  { name: "Momina Duraid", phone: "+92-393-4567893", email: "momina.duraid@gmail.com", gender: "Female", dob: "1971-06-30", address: "Sector E-7, Islamabad", alert: null },
  { name: "Asim Raza", phone: "+92-394-5678904", email: "asim.raza@yahoo.com", gender: "Male", dob: "1966-08-21", address: "Sector F-8/2, Islamabad", alert: "Cardiac stent (on Clopidogrel)" },

  // 96-105
  { name: "Sarmad Khoosat", phone: "+92-395-6789015", email: "sarmad.k@gmail.com", gender: "Male", dob: "1979-05-07", address: "Sector G-8/1, Islamabad", alert: null },
  { name: "Sania Saeed", phone: "+92-396-7890126", email: "sania.saeed@gmail.com", gender: "Female", dob: "1972-08-28", address: "Sector G-10/2, Islamabad", alert: null },
  { name: "Naumaan Ijaz", phone: "+92-397-8901237", email: "naumaan.ijaz@gmail.com", gender: "Male", dob: "1965-02-14", address: "DHA Phase 1, Islamabad", alert: null },
  { name: "Zaviyar Naumaan", phone: "+92-398-9012348", email: "zaviyar.n@outlook.com", gender: "Male", dob: "1996-01-14", address: "Bahria Phase 4, Rawalpindi", alert: null },
  { name: "Sajid Hasan", phone: "+92-399-0123459", email: "sajid.hasan@gmail.com", gender: "Male", dob: "1960-03-24", address: "Sector F-6/3, Islamabad", alert: null },
  { name: "Marina Khan", phone: "+92-300-9876543", email: "marina.khan@gmail.com", gender: "Female", dob: "1962-12-26", address: "Sector E-11/1, Islamabad", alert: null },
  { name: "Shahnaz Sheikh", phone: "+92-301-8765432", email: "shahnaz.s@yahoo.com", gender: "Female", dob: "1960-09-17", address: "Sector F-7/2, Islamabad", alert: null },
  { name: "Rahat Fateh Ali", phone: "+92-302-7654321", email: "rahat.fateh@gmail.com", gender: "Male", dob: "1974-12-09", address: "Sector F-8/3, Islamabad", alert: "Diabetic (Type 2)" },
  { name: "Abida Parveen", phone: "+92-303-6543210", email: "abida.p@gmail.com", gender: "Female", dob: "1954-02-20", address: "Sector G-8 Markaz, Islamabad", alert: "Cardiac pacemaker" },
  { name: "Naseebo Lal", phone: "+92-304-5432109", email: "naseebo.l@outlook.com", gender: "Female", dob: "1970-01-10", address: "Satellite Town, Rawalpindi", alert: null },

  // 106-120
  { name: "Abrar-ul-Haq", phone: "+92-305-4321098", email: "abrar.haq@gmail.com", gender: "Male", dob: "1969-07-21", address: "Sector G-11/4, Islamabad", alert: null },
  { name: "Jawad Ahmad", phone: "+92-306-3210987", email: "jawad.ahmad@gmail.com", gender: "Male", dob: "1970-09-29", address: "Sector G-13/4, Islamabad", alert: null },
  { name: "Faakhir Mehmood", phone: "+92-307-2109876", email: "faakhir.m@yahoo.com", gender: "Male", dob: "1973-04-20", address: "Bahria Phase 6, Rawalpindi", alert: null },
  { name: "Haroon Rashid", phone: "+92-308-1098765", email: "haroon.rashid@gmail.com", gender: "Male", dob: "1973-05-11", address: "Sector F-11/3, Islamabad", alert: null },
  { name: "Bilal Maqsood", phone: "+92-309-0987654", email: "bilal.maqsood@gmail.com", gender: "Male", dob: "1971-03-23", address: "DHA Phase 2, Islamabad", alert: null },
  { name: "Faisal Kapadia", phone: "+92-310-9876541", email: "faisal.kapadia@gmail.com", gender: "Male", dob: "1971-06-29", address: "Sector F-7/4, Islamabad", alert: null },
  { name: "Zoe Viccaji", phone: "+92-311-8765430", email: "zoe.v@outlook.com", gender: "Female", dob: "1983-09-01", address: "Sector F-6/2, Islamabad", alert: null },
  { name: "Rachel Viccaji", phone: "+92-312-7654329", email: "rachel.v@gmail.com", gender: "Female", dob: "1989-11-04", address: "Sector F-6/2, Islamabad", alert: null },
  { name: "Farooq Mengal", phone: "+92-313-6543218", email: "farooq.m@yahoo.com", gender: "Male", dob: "1968-04-18", address: "Sector I-8/3, Islamabad", alert: null },
  { name: "Qavi Khan", phone: "+92-314-5432107", email: "qavi.khan@gmail.com", gender: "Male", dob: "1942-11-13", address: "Westridge 1, Rawalpindi", alert: "Cardiac history - check BP before injection" },
  { name: "Talat Hussain", phone: "+92-315-4321096", email: "talat.hussain@gmail.com", gender: "Male", dob: "1940-09-18", address: "Sector F-8/1, Islamabad", alert: null },
  { name: "Bushra Farrukh", phone: "+92-316-3210985", email: "bushra.f@gmail.com", gender: "Female", dob: "1957-02-15", address: "Sector G-10/3, Islamabad", alert: null },
  { name: "Arshad Nadeem", phone: "+92-317-2109874", email: "arshad.nadeem@outlook.com", gender: "Male", dob: "1997-01-02", address: "Sector H-13, Islamabad", alert: "Athlete - no banned substances" },
  { name: "Babar Ali", phone: "+92-318-1098763", email: "babar.ali@gmail.com", gender: "Male", dob: "1975-06-30", address: "Askari 14, Rawalpindi", alert: null },
  { name: "Reema Khan", phone: "+92-319-0987652", email: "reema.khan@gmail.com", gender: "Female", dob: "1971-10-27", address: "Sector E-7, Islamabad", alert: "Aesthetic sensitivity - prefers tooth-colored composite" },
];

async function main() {
  console.log('🚀 Starting Enterprise Clinical Data Feed...');
  console.log(`🎯 Target: ${PATIENT_PROFILES.length} Patients & 2,000 Treatments/Appointments across 40 Days`);

  // Ensure Admin & Staff exist
  const adminHash = await bcrypt.hash('admin123', 10);
  const staffHash = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@elitedental.com' },
    update: {},
    create: {
      email: 'admin@elitedental.com',
      phone: '+92-300-0000001',
      password: adminHash,
      name: 'Dr. Admin',
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff1@elitedental.com' },
    update: {},
    create: {
      email: 'staff1@elitedental.com',
      phone: '+92-300-0000002',
      password: staffHash,
      name: 'Receptionist Sarah',
      role: 'STAFF',
    },
  });

  console.log(`✅ Verified Staff & Admin Accounts`);

  // Fetch all active treatments from catalog
  const treatments = await prisma.treatment.findMany({
    where: { isActive: true },
    orderBy: { price: 'desc' },
  });

  if (treatments.length === 0) {
    console.error('❌ No treatments found in DB. Please run seed script first!');
    process.exit(1);
  }
  console.log(`✅ Loaded ${treatments.length} Clinical Procedures from Catalog`);

  // 1. Wipe old clinical records cleanly (Clean Fresh Feed)
  console.log('🧹 Clearing previous appointments, clinical notes, and patients...');
  await prisma.payment.deleteMany();
  await prisma.clinicalNote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.planChangeLog.deleteMany();
  await prisma.patientTreatment.deleteMany();
  await prisma.user.deleteMany({ where: { role: 'PATIENT' } });
  console.log('✨ Clean slate ready.');

  // 2. Create the 120 Patients
  console.log(`👤 Creating ${PATIENT_PROFILES.length} authentic patient accounts...`);
  const patientHash = await bcrypt.hash('patient123', 10);
  const createdPatients = [];

  for (let i = 0; i < PATIENT_PROFILES.length; i++) {
    const p = PATIENT_PROFILES[i];
    const patientCode = 1001 + i;

    const user = await prisma.user.create({
      data: {
        name: p.name,
        email: p.email,
        phone: p.phone,
        password: patientHash,
        role: 'PATIENT',
        patientCode: patientCode,
        gender: p.gender,
        dateOfBirth: new Date(p.dob),
        address: p.address,
        medicalAlerts: p.alert,
      },
    });
    createdPatients.push(user);
  }
  console.log(`✅ Created ${createdPatients.length} Patients (ID Range: 1001 – ${1000 + createdPatients.length})`);

  // 3. Create Multi-Session Treatment Plans (~35 patients)
  console.log('📋 Enrolling patients in comprehensive multi-session treatment plans...');
  const createdPlans = [];

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  const planTypes = [
    { name: 'German Implant Kit', totalSessions: 3, cost: 80000 },
    { name: 'American Implant Kit', totalSessions: 3, cost: 70000 },
    { name: 'Clear Aligner System', totalSessions: 6, cost: 175000 },
    { name: 'Ceramic Braces Program', totalSessions: 8, cost: 110000 },
    { name: 'Multi Canal Retreatment', totalSessions: 3, cost: 24000 },
    { name: 'Porcelain Veneer Smile Makeover', totalSessions: 4, cost: 95000 },
  ];

  for (let i = 0; i < 35; i++) {
    const patient = createdPatients[i];
    const planSpec = planTypes[i % planTypes.length];
    const matchedTreatment = treatments.find(t => t.name.toLowerCase().includes(planSpec.name.toLowerCase().split(' ')[0])) || treatments[0];

    const completed = (i % 3 === 0) ? 2 : (i % 2 === 0) ? 1 : 0;
    const sessionCost = Math.round(planSpec.cost / planSpec.totalSessions);
    const totalPaid = completed * sessionCost;

    const plan = await prisma.patientTreatment.create({
      data: {
        patientId: patient.id,
        treatmentId: matchedTreatment.id,
        totalCost: planSpec.cost,
        totalSessions: planSpec.totalSessions,
        clinicalStatus: completed >= planSpec.totalSessions ? 'COMPLETED' : 'IN_PROGRESS',
        financialStatus: totalPaid >= planSpec.cost ? 'FULLY_PAID' : totalPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID',
        status: completed >= planSpec.totalSessions ? 'COMPLETED' : 'ONGOING',
        startDate: new Date(todayMidnight.getTime() - (completed + 1) * 14 * 86400000),
      },
    });

    createdPlans.push({
      plan,
      matchedTreatment,
      planSpec,
      completed,
      sessionCost,
      patient,
    });
  }
  console.log(`✅ Created ${createdPlans.length} Active Treatment Plans with Installment Schedules`);

  // 4. Generate 2,000 Clinically Realistic Appointments
  console.log('⚡ Generating 2,000 appointments (Past 60 Days + Today + Next 40 Days)...');

  const patientTreatmentsToInsert = [];
  const appointmentsToInsert = [];
  const clinicalNotesToInsert = [];
  const paymentsToInsert = [];

  // Helper to match treatments
  const findTreatment = (keyword) => {
    return treatments.find(t => t.name.toLowerCase().includes(keyword.toLowerCase())) || treatments[0];
  };

  // Time Slot generator helper (12 PM to 8 PM)
  const CLINIC_SLOTS = [
    { hour: 12, min: 0 },
    { hour: 12, min: 30 },
    { hour: 13, min: 0 },
    { hour: 13, min: 30 },
    { hour: 14, min: 0 },
    { hour: 14, min: 30 },
    { hour: 15, min: 0 },
    { hour: 15, min: 30 },
    { hour: 16, min: 0 },
    { hour: 16, min: 30 },
    { hour: 17, min: 0 },
    { hour: 17, min: 30 },
    { hour: 18, min: 0 },
    { hour: 18, min: 30 },
    { hour: 19, min: 0 },
    { hour: 19, min: 30 },
  ];

  const BOOKING_SOURCES = ['WEBSITE', 'WALK_IN', 'WHATSAPP_BOT'];

  // ───────────────────────────────────────────────────────────
  // PART A: ~790 HISTORICAL APPOINTMENTS (Past 60 Days)
  // ───────────────────────────────────────────────────────────
  console.log('   ↳ Synthesizing ~790 historical clinical encounters with notes & payments...');

  let apptIndex = 0;
  const pastDaysCount = 60;
  const apptsPerPastDay = Math.floor(790 / pastDaysCount); // ~13 per day

  for (let dayOffset = pastDaysCount; dayOffset >= 1; dayOffset--) {
    const dayDate = new Date(todayMidnight.getTime() - dayOffset * 86400000);
    // Skip Sunday
    if (dayDate.getDay() === 0) continue;

    for (let slotIdx = 0; slotIdx < apptsPerPastDay; slotIdx++) {
      const slot = CLINIC_SLOTS[slotIdx % CLINIC_SLOTS.length];
      const startTime = new Date(dayDate);
      startTime.setHours(slot.hour, slot.min, 0, 0);

      const patient = createdPatients[apptIndex % createdPatients.length];
      const treatment = treatments[apptIndex % treatments.length];
      const durationMin = treatment.durationMin || 45;
      const endTime = new Date(startTime.getTime() + durationMin * 60000);

      // Status distribution for past: 91% COMPLETED, 5% NO_SHOW, 4% CANCELLED
      const rand = (apptIndex * 17) % 100;
      let status = 'COMPLETED';
      let discount = (rand < 10) ? Math.round(treatment.price * 0.1) : 0;
      const netTotal = Math.max(0, treatment.price - discount);

      // Partial payment realistic distribution: 20% partial payments (with remaining balance)
      let amountPaid = netTotal;
      if (rand >= 91 && rand < 96) {
        status = 'NO_SHOW';
        amountPaid = 0;
      } else if (rand >= 96) {
        status = 'CANCELLED';
        amountPaid = 0;
      } else if (rand < 20 && netTotal > 15000) {
        // Partial installment payment
        amountPaid = Math.round(netTotal * 0.5);
      }

      const aptId = crypto.randomUUID();
      const ptId = crypto.randomUUID();

      // Create single-visit treatment ledger if not part of multi-session plan
      patientTreatmentsToInsert.push({
        id: ptId,
        patientId: patient.id,
        treatmentId: treatment.id,
        totalCost: netTotal,
        totalSessions: 1,
        clinicalStatus: status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
        financialStatus: amountPaid >= netTotal ? 'FULLY_PAID' : amountPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID',
        status: status === 'COMPLETED' ? 'COMPLETED' : 'ONGOING',
        startDate: startTime,
        updatedAt: endTime,
      });

      appointmentsToInsert.push({
        id: aptId,
        startTime,
        endTime,
        status,
        bookedBy: BOOKING_SOURCES[apptIndex % BOOKING_SOURCES.length],
        patientId: patient.id,
        treatmentId: treatment.id,
        price: treatment.price,
        amountPaid,
        discount,
        checkoutTime: status === 'COMPLETED' ? endTime : null,
        createdAt: new Date(startTime.getTime() - 86400000 * 2),
        patientTreatmentId: ptId,
        sessionNumber: 1,
        sessionLabel: 'Single Visit',
      });

      // Clinical Note for completed visits
      if (status === 'COMPLETED') {
        clinicalNotesToInsert.push({
          id: crypto.randomUUID(),
          appointmentId: aptId,
          diagnosis: `Clinical examination: ${treatment.name} indicated. Soft & hard tissue evaluation clear.`,
          treatmentDone: `Successfully completed ${treatment.name}. Local anesthesia administered. Post-operative instructions given.`,
          prescription: treatment.instructions || "Amoxicillin 500mg TDS x 5 days, Paracetamol 1000mg SOS, Chlorhexidine 0.2%",
          remarks: amountPaid < netTotal
            ? `Remaining balance of Rs. ${(netTotal - amountPaid).toLocaleString()} due at subsequent visit.`
            : "Patient tolerated treatment smoothly. Account fully settled.",
          createdAt: endTime,
          updatedAt: endTime,
        });

        // Payment record
        if (amountPaid > 0) {
          paymentsToInsert.push({
            id: crypto.randomUUID(),
            appointmentId: aptId,
            patientTreatmentId: ptId,
            amount: amountPaid,
            method: (apptIndex % 2 === 0) ? 'CASH' : 'CARD',
            date: endTime,
            notes: amountPaid < netTotal
              ? `Partial payment for ${treatment.name} (Balance Rs. ${(netTotal - amountPaid).toLocaleString()} pending)`
              : `Full payment for ${treatment.name}`,
          });
        }
      }

      apptIndex++;
    }
  }

  // ───────────────────────────────────────────────────────────
  // PART B: 12 TODAY'S APPOINTMENTS (Nov 11, 2026)
  // ───────────────────────────────────────────────────────────
  console.log('   ↳ Scheduling today’s active clinical queue (Nov 11, 2026)...');

  // Specific high-profile patients for today showcasing full and partial payments & multi-session
  const getPatientByName = (name) => createdPatients.find(p => p.name === name) || createdPatients[0];

  const todaySpecs = [
    {
      h: 12, m: 0, status: 'COMPLETED', chair: 'Chair 1',
      patient: getPatientByName('Shehzad Roy'),
      treatment: findTreatment('German Implant'),
      discount: 0,
      amountPaidRatio: 1.0, // Fully Paid (Rs. 80,000)
      sessionNumber: 1, totalSessions: 3,
    },
    {
      h: 12, m: 30, status: 'COMPLETED', chair: 'Chair 2',
      patient: getPatientByName('Hadiqa Kiani'),
      treatment: findTreatment('Braces'),
      discount: 0,
      amountPaidCustom: 25000, // Partial Payment (Rs. 25,000 paid out of Rs. 75,000 -> Rs. 50,000 Remaining!)
      sessionNumber: 1, totalSessions: 4,
    },
    {
      h: 13, m: 0, status: 'COMPLETED', chair: 'Chair 3',
      patient: getPatientByName('Ali Zafar'),
      treatment: findTreatment('American Implant') || findTreatment('Implant'),
      discount: 0,
      amountPaidCustom: 35000, // 50% Surgical deposit paid (Rs. 35,000 Remaining!)
      sessionNumber: 1, totalSessions: 3,
    },
    {
      h: 13, m: 30, status: 'COMPLETED', chair: 'Chair 4',
      patient: getPatientByName('Aima Baig'),
      treatment: findTreatment('Whitening'),
      discount: 2000, // Rs. 37,000 - 2,000 = Rs. 35,000 net
      amountPaidCustom: 20000, // Rs. 20,000 paid -> Rs. 15,000 Remaining!
      sessionNumber: 1, totalSessions: 1,
    },
    {
      h: 14, m: 0, status: 'SCHEDULED', chair: 'Chair 1',
      patient: getPatientByName('Farhan Saeed'),
      treatment: findTreatment('Ceramic Braces') || findTreatment('Braces'),
      discount: 0, amountPaidCustom: 0, plannedFee: 15000,
      sessionNumber: 2, totalSessions: 8,
    },
    {
      h: 14, m: 30, status: 'SCHEDULED', chair: 'Chair 2',
      patient: getPatientByName('Maya Ali'),
      treatment: findTreatment('Aligner') || findTreatment('Braces'),
      discount: 0, amountPaidCustom: 0, plannedFee: 30000,
      sessionNumber: 1, totalSessions: 6,
    },
    {
      h: 15, m: 0, status: 'SCHEDULED', chair: 'Chair 3',
      patient: getPatientByName('Bilal Abbas'),
      treatment: findTreatment('Canal') || treatments[1],
      discount: 0, amountPaidCustom: 0, plannedFee: 8000,
      sessionNumber: 2, totalSessions: 3,
    },
    {
      h: 15, m: 30, status: 'SCHEDULED', chair: 'Chair 4',
      patient: getPatientByName('Zara Noor Abbas'),
      treatment: findTreatment('Veneer') || treatments[2],
      discount: 0, amountPaidCustom: 0, plannedFee: 25000,
      sessionNumber: 1, totalSessions: 4,
    },
    {
      h: 16, m: 30, status: 'SCHEDULED', chair: 'Chair 1',
      patient: getPatientByName('Babar Azam'),
      treatment: findTreatment('Scaling') || findTreatment('Hygiene'),
      discount: 0, amountPaidCustom: 0, plannedFee: 12000,
      sessionNumber: 1, totalSessions: 1,
    },
    {
      h: 17, m: 0, status: 'SCHEDULED', chair: 'Chair 2',
      patient: getPatientByName('Sajal Aly'),
      treatment: findTreatment('Composite') || treatments[3],
      discount: 0, amountPaidCustom: 0, plannedFee: 15000,
      sessionNumber: 1, totalSessions: 1,
    },
    {
      h: 18, m: 0, status: 'SCHEDULED', chair: 'Chair 3',
      patient: getPatientByName('Wahaj Ali'),
      treatment: findTreatment('Hygiene') || treatments[4],
      discount: 0, amountPaidCustom: 0, plannedFee: 8000,
      sessionNumber: 1, totalSessions: 1,
    },
    {
      h: 19, m: 0, status: 'SCHEDULED', chair: 'Chair 4',
      patient: getPatientByName('Hania Aamir'),
      treatment: findTreatment('Consultation') || treatments[5],
      discount: 0, amountPaidCustom: 0, plannedFee: 3500,
      sessionNumber: 1, totalSessions: 1,
    },
  ];

  for (let i = 0; i < todaySpecs.length; i++) {
    const spec = todaySpecs[i];
    const startTime = new Date(todayMidnight);
    startTime.setHours(spec.h, spec.m, 0, 0);

    const patient = spec.patient;
    const treatment = spec.treatment;
    const endTime = new Date(startTime.getTime() + (treatment.durationMin || 45) * 60000);
    const aptId = crypto.randomUUID();

    const price = treatment.price;
    const discount = spec.discount || 0;
    const netTotal = Math.max(0, price - discount);

    let amountPaid = 0;
    if (spec.status === 'COMPLETED') {
      if (spec.amountPaidCustom !== undefined) {
        amountPaid = spec.amountPaidCustom;
      } else if (spec.amountPaidRatio !== undefined) {
        amountPaid = Math.round(netTotal * spec.amountPaidRatio);
      } else {
        amountPaid = netTotal;
      }
    }

    const ptId = crypto.randomUUID();

    patientTreatmentsToInsert.push({
      id: ptId,
      patientId: patient.id,
      treatmentId: treatment.id,
      totalCost: netTotal,
      totalSessions: spec.totalSessions || 1,
      clinicalStatus: spec.status === 'COMPLETED' ? (spec.totalSessions > 1 ? 'IN_PROGRESS' : 'COMPLETED') : 'IN_PROGRESS',
      financialStatus: amountPaid >= netTotal ? 'FULLY_PAID' : amountPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID',
      status: spec.status === 'COMPLETED' ? (spec.totalSessions > 1 ? 'ONGOING' : 'COMPLETED') : 'ONGOING',
      startDate: startTime,
      updatedAt: endTime,
    });

    appointmentsToInsert.push({
      id: aptId,
      startTime,
      endTime,
      status: spec.status,
      bookedBy: BOOKING_SOURCES[i % 3],
      patientId: patient.id,
      treatmentId: treatment.id,
      price: price,
      amountPaid,
      discount,
      checkoutTime: spec.status === 'COMPLETED' ? endTime : null,
      createdAt: new Date(todayMidnight.getTime() - 86400000),
      patientTreatmentId: ptId,
      sessionNumber: spec.sessionNumber,
      sessionLabel: spec.totalSessions > 1 ? `Session ${spec.sessionNumber} of ${spec.totalSessions}` : 'Single Visit',
      plannedFee: spec.plannedFee || null,
    });

    if (spec.status === 'COMPLETED') {
      clinicalNotesToInsert.push({
        id: crypto.randomUUID(),
        appointmentId: aptId,
        diagnosis: `Clinical consultation and procedure for ${treatment.name}. Operatory suite prepped.`,
        treatmentDone: `Successfully conducted ${treatment.name} (Session ${spec.sessionNumber}). Patient given post-treatment protocol.`,
        prescription: "Chlorhexidine 0.2% mouthwash BID, Paracetamol 1000mg SOS",
        remarks: amountPaid < netTotal
          ? `Partial payment recorded: Rs. ${amountPaid.toLocaleString()}. Outstanding balance: Rs. ${(netTotal - amountPaid).toLocaleString()} due next session.`
          : "Treatment completed smoothly. Account settled in full.",
        createdAt: endTime,
        updatedAt: endTime,
      });

      if (amountPaid > 0) {
        paymentsToInsert.push({
          id: crypto.randomUUID(),
          appointmentId: aptId,
          patientTreatmentId: ptId,
          amount: amountPaid,
          method: (i % 2 === 0) ? 'CASH' : 'CARD',
          date: endTime,
          notes: amountPaid < netTotal
            ? `Partial counter settlement for ${treatment.name} (Session ${spec.sessionNumber})`
            : `Full payment settlement: ${treatment.name}`,
        });
      }
    }

    apptIndex++;
  }

  // ───────────────────────────────────────────────────────────
  // PART C: ~1,198 FUTURE APPOINTMENTS (Next 40 Days: Nov 12 - Dec 21, 2026)
  // ───────────────────────────────────────────────────────────
  console.log('   ↳ Structuring ~1,200 upcoming appointments over next 40 days across 4 Operatories...');

  const futureDaysTarget = 40;
  const targetTotal = 2000;
  const remainingCount = targetTotal - appointmentsToInsert.length; // ~1,198

  let futureWorkingDays = 0;
  for (let d = 1; d <= futureDaysTarget; d++) {
    const testDate = new Date(todayMidnight.getTime() + d * 86400000);
    if (testDate.getDay() !== 0) futureWorkingDays++; // Skip Sundays
  }

  const apptsPerFutureDay = Math.ceil(remainingCount / futureWorkingDays); // ~35 per day

  let insertedFuture = 0;
  for (let d = 1; d <= futureDaysTarget && appointmentsToInsert.length < targetTotal; d++) {
    const dayDate = new Date(todayMidnight.getTime() + d * 86400000);
    // Sunday Closed
    if (dayDate.getDay() === 0) continue;

    for (let slotIdx = 0; slotIdx < apptsPerFutureDay && appointmentsToInsert.length < targetTotal; slotIdx++) {
      const slot = CLINIC_SLOTS[slotIdx % CLINIC_SLOTS.length];
      const startTime = new Date(dayDate);
      const chairOffsetMin = (Math.floor(slotIdx / CLINIC_SLOTS.length)) * 5;
      startTime.setHours(slot.hour, slot.min + chairOffsetMin, 0, 0);

      const patient = createdPatients[apptIndex % createdPatients.length];
      const treatment = treatments[apptIndex % treatments.length];
      const durationMin = treatment.durationMin || 45;
      const endTime = new Date(startTime.getTime() + durationMin * 60000);

      // Future status: 97% SCHEDULED, 3% CANCELLED
      const isCancelled = ((apptIndex * 23) % 100) < 3;
      const status = isCancelled ? 'CANCELLED' : 'SCHEDULED';

      const aptId = crypto.randomUUID();
      const ptId = crypto.randomUUID();
      const isMulti = treatment.isMultiSession || (treatment.defaultSessions && treatment.defaultSessions > 1);
      const totalSess = treatment.defaultSessions || 1;
      const sessNum = isMulti ? ((apptIndex % totalSess) + 1) : 1;

      patientTreatmentsToInsert.push({
        id: ptId,
        patientId: patient.id,
        treatmentId: treatment.id,
        totalCost: treatment.price,
        totalSessions: totalSess,
        clinicalStatus: 'IN_PROGRESS',
        financialStatus: 'UNPAID',
        status: 'ONGOING',
        startDate: startTime,
        updatedAt: startTime,
      });

      appointmentsToInsert.push({
        id: aptId,
        startTime,
        endTime,
        status,
        bookedBy: BOOKING_SOURCES[apptIndex % BOOKING_SOURCES.length],
        patientId: patient.id,
        treatmentId: treatment.id,
        price: treatment.price,
        amountPaid: 0,
        discount: 0,
        checkoutTime: null,
        createdAt: new Date(todayMidnight.getTime() - (apptIndex % 5) * 86400000),
        patientTreatmentId: ptId,
        sessionNumber: sessNum,
        sessionLabel: isMulti ? `Session ${sessNum} of ${totalSess}` : 'Single Visit',
        plannedFee: isMulti ? Math.round(treatment.price / totalSess) : treatment.price,
      });

      apptIndex++;
      insertedFuture++;
    }
  }

  console.log(`\n📦 Batch Pre-Compiled:`);
  console.log(`   • Total Patient Treatments: ${patientTreatmentsToInsert.length}`);
  console.log(`   • Total Appointments to Insert: ${appointmentsToInsert.length}`);
  console.log(`   • Total Clinical Notes: ${clinicalNotesToInsert.length}`);
  console.log(`   • Total Payments: ${paymentsToInsert.length}`);

  // 5. High-Speed Chunked Insertion into PostgreSQL
  console.log('\n💾 Executing high-speed chunked batch writes to database...');

  const CHUNK_SIZE = 300;

  // Insert Patient Treatments in chunks
  for (let i = 0; i < patientTreatmentsToInsert.length; i += CHUNK_SIZE) {
    const chunk = patientTreatmentsToInsert.slice(i, i + CHUNK_SIZE);
    await prisma.patientTreatment.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    process.stdout.write(`   ↳ Patient Treatments inserted: ${Math.min(i + CHUNK_SIZE, patientTreatmentsToInsert.length)}/${patientTreatmentsToInsert.length}\r`);
  }
  console.log(`\n✅ 100% of ${patientTreatmentsToInsert.length} Patient Treatment Ledgers committed.`);

  // Insert Appointments in chunks
  for (let i = 0; i < appointmentsToInsert.length; i += CHUNK_SIZE) {
    const chunk = appointmentsToInsert.slice(i, i + CHUNK_SIZE);
    await prisma.appointment.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    process.stdout.write(`   ↳ Appointments inserted: ${Math.min(i + CHUNK_SIZE, appointmentsToInsert.length)}/${appointmentsToInsert.length}\r`);
  }
  console.log(`\n✅ 100% of ${appointmentsToInsert.length} Appointments committed.`);

  // Insert Clinical Notes in chunks
  for (let i = 0; i < clinicalNotesToInsert.length; i += CHUNK_SIZE) {
    const chunk = clinicalNotesToInsert.slice(i, i + CHUNK_SIZE);
    await prisma.clinicalNote.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    process.stdout.write(`   ↳ Clinical Notes inserted: ${Math.min(i + CHUNK_SIZE, clinicalNotesToInsert.length)}/${clinicalNotesToInsert.length}\r`);
  }
  console.log(`\n✅ 100% of ${clinicalNotesToInsert.length} Clinical Notes committed.`);

  // Insert Payments in chunks
  for (let i = 0; i < paymentsToInsert.length; i += CHUNK_SIZE) {
    const chunk = paymentsToInsert.slice(i, i + CHUNK_SIZE);
    await prisma.payment.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    process.stdout.write(`   ↳ Payments inserted: ${Math.min(i + CHUNK_SIZE, paymentsToInsert.length)}/${paymentsToInsert.length}\r`);
  }
  console.log(`\n✅ 100% of ${paymentsToInsert.length} Payment records committed.`);

  // 6. Final Telemetry Audit
  const finalPatientCount = await prisma.user.count({ where: { role: 'PATIENT' } });
  const finalApptCount = await prisma.appointment.count();
  const scheduledCount = await prisma.appointment.count({ where: { status: 'SCHEDULED' } });
  const completedCount = await prisma.appointment.count({ where: { status: 'COMPLETED' } });
  const cancelledCount = await prisma.appointment.count({ where: { status: 'CANCELLED' } });
  const revenueAgg = await prisma.appointment.aggregate({ _sum: { amountPaid: true } });

  console.log('\n========================================================');
  console.log('🎉 2,000 TREATMENTS & 120 PATIENTS FEED COMPLETED!');
  console.log('========================================================');
  console.log(`👥 Registered Patients:         ${finalPatientCount}`);
  console.log(`🦷 Total Clinical Treatments:   ${finalApptCount}`);
  console.log(`📅 Scheduled (Next 40 Days):    ${scheduledCount}`);
  console.log(`✅ Completed (Historical/Today): ${completedCount}`);
  console.log(`❌ Cancelled / No-Shows:        ${cancelledCount}`);
  console.log(`💰 Realized Clinical Revenue:   Rs. ${(revenueAgg._sum.amountPaid || 0).toLocaleString()}`);
  console.log('========================================================\n');
  console.log('Credentials:');
  console.log('  Admin Portal: admin@elitedental.com / admin123');
  console.log('  Staff Portal: staff1@elitedental.com / staff123');
}

main()
  .catch((err) => {
    console.error('❌ Data feed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
