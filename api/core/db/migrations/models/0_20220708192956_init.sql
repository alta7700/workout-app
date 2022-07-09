-- upgrade --
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);
CREATE TABLE IF NOT EXISTS "subject" (
    "id" SMALLSERIAL NOT NULL PRIMARY KEY,
    "title" VARCHAR(200) NOT NULL,
    "short_title" VARCHAR(30) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "fathers_name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(25) NOT NULL UNIQUE,
    "hashed_password" VARCHAR(200) NOT NULL,
    "password_change_dt" TIMESTAMPTZ NOT NULL,
    "is_active" BOOL NOT NULL  DEFAULT True,
    "is_teacher" BOOL NOT NULL  DEFAULT False,
    "is_superuser" BOOL NOT NULL  DEFAULT False,
    "faculty_id" SMALLINT,
    "course_n" SMALLINT,
    "group_n" SMALLINT,
    "is_head" BOOL,
    "last_login" TIMESTAMPTZ,
    "joined_at" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "studentteachers" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "student_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "subject_id" SMALLINT NOT NULL REFERENCES "subject" ("id") ON DELETE CASCADE,
    "teacher_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_studentteac_student_b69fbc" UNIQUE ("student_id", "subject_id")
);
CREATE TABLE IF NOT EXISTS "teachersubject" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "subject_id" SMALLINT NOT NULL REFERENCES "subject" ("id") ON DELETE CASCADE,
    "teacher_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_teachersubj_teacher_caeb11" UNIQUE ("teacher_id", "subject_id")
);
CREATE TABLE IF NOT EXISTS "workout" (
    "id" SMALLSERIAL NOT NULL PRIMARY KEY,
    "random_key" VARCHAR(50) NOT NULL,
    "comment" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "student_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "subject_id" SMALLINT NOT NULL REFERENCES "subject" ("id") ON DELETE CASCADE,
    "teacher_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
