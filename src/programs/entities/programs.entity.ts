import { CustomBaseEntity } from "../../../common/entities/custom-base.entity";
import { Column, Entity, Index } from "typeorm";
import { ProgramsInterface } from "../interface/programs.interface";

@Entity({ name: 'co_programs', schema: 'public'})
@Index(['id'])
export class ProgramsEntity extends CustomBaseEntity implements ProgramsInterface {
    @Column({ name: 'university', type: 'varchar', unique: true, nullable: false })
    university: string;

    @Column({ name: 'location', type: 'varchar', unique: true, nullable: false })
    location: string;

    @Column({ name: 'degreeType', type: 'varchar', unique: false, nullable: false })
    degreeType: string;

    @Column({ name: 'subject', type: 'varchar', unique: false, nullable: false })
    subject: string;

    @Column({ name: 'required_degree', type: 'varchar', unique: false, nullable: false })
    requiredDegree: string;

    @Column({ name: 'tuition_fee', type: 'varchar', unique: false, nullable: false })
    tuitionFee: string;

    @Column({ name: 'required_gpa', type: 'varchar', unique: false, nullable: false })
    requiredGpa: string;

    @Column({ name: 'english_lang_test_score', type: 'varchar', unique: false, nullable: false })
    englishLanguageTestScore: string;

    @Column({ name: 'german_lang_test_score', type: 'varchar', unique: false, nullable: false })
    germanLanguageTestScore: string;

    @Column({ name: 'gre_score', type: 'varchar', unique: false, nullable: false })
    greScore: string;

    @Column({ name: 'admission_type', type: 'varchar', unique: false, nullable: false })
    admissionType: string;

    @Column({ name: 'admission_session', type: 'varchar', unique: false, nullable: false })
    admissionSession: string;

    @Column({ name: 'course_website', type: 'varchar', unique: false, nullable: false })
    courseWebsite: string;

    @Column({ name: 'apply_via', type: 'varchar', unique: false, nullable: false })
    applyVia: string;

    @Column({ name: 'language_of_study', type: 'varchar', unique: false, nullable: false })
    languageOfStudy: string;

    @Column({ name: 'applicaiton_start_date_summer', type: 'date', unique: false, nullable: true })
    appStartDateSummer: Date;

    @Column({ name: 'applicaiton_start_date_winter', type: 'date', unique: false, nullable: true })
    appStartDateWinter: Date;

    @Column({ name: 'applicaiton_end_date_summer', type: 'date', unique: false, nullable: false })
    appEndDateSummer: Date;

    @Column({ name: 'applicaiton_end_date_winter', type: 'date', unique: false, nullable: false })
    appEndDateWinter: Date;

    @Column({ name: 'program_duration', type: 'varchar', unique: false, nullable: false })
    programDuration: string;

    @Column({ name: 'ects', type: 'varchar', unique: false, nullable: false })
    ects: string;

    @Column({ name: 'selection_procedure', type: 'varchar', unique: false, nullable: false })
    selectionProcedure: string;
}
