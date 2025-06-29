USE [master]
GO
/****** Object:  Database [taskmind_db]    Script Date: 17/6/2025 11:42:07 ******/
CREATE DATABASE [taskmind_db]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'taskmind_db', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\taskmind_db.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'taskmind_db_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\taskmind_db_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [taskmind_db] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [taskmind_db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [taskmind_db] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [taskmind_db] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [taskmind_db] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [taskmind_db] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [taskmind_db] SET ARITHABORT OFF 
GO
ALTER DATABASE [taskmind_db] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [taskmind_db] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [taskmind_db] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [taskmind_db] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [taskmind_db] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [taskmind_db] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [taskmind_db] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [taskmind_db] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [taskmind_db] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [taskmind_db] SET  ENABLE_BROKER 
GO
ALTER DATABASE [taskmind_db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [taskmind_db] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [taskmind_db] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [taskmind_db] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [taskmind_db] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [taskmind_db] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [taskmind_db] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [taskmind_db] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [taskmind_db] SET  MULTI_USER 
GO
ALTER DATABASE [taskmind_db] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [taskmind_db] SET DB_CHAINING OFF 
GO
ALTER DATABASE [taskmind_db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [taskmind_db] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [taskmind_db] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [taskmind_db] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [taskmind_db] SET QUERY_STORE = ON
GO
ALTER DATABASE [taskmind_db] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [taskmind_db]
GO
/****** Object:  User [dev]    Script Date: 17/6/2025 11:42:08 ******/
CREATE USER [dev] FOR LOGIN [dev] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [dev]
GO
/****** Object:  Table [dbo].[tsim_course]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsim_course](
	[ID_COURSE] [int] IDENTITY(1,1) NOT NULL,
	[DSC_NAME] [nvarchar](100) NOT NULL,
	[ID_TEACHER] [int] NULL,
	[DSC_CODE] [nvarchar](50) NULL,
	[DSC_ATTENTION] [nvarchar](255) NULL,
	[DSC_COLOR] [nvarchar](8) NOT NULL,
	[ID_USER] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_COURSE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsim_day]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsim_day](
	[ID_DAY] [int] IDENTITY(1,1) NOT NULL,
	[DSC_NAME] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_DAY] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsim_evaluation_type]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsim_evaluation_type](
	[ID_TYPE] [int] IDENTITY(1,1) NOT NULL,
	[ID_COURSE] [int] NULL,
	[DSC_NAME] [nvarchar](50) NOT NULL,
	[WEIGHT] [decimal](5, 2) NOT NULL,
	[DATE_EVALUATION] [datetime] NULL,
	[DSC_EVALUATION] [nvarchar](100) NOT NULL,
	[ID_USER] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_TYPE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsim_schedule]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsim_schedule](
	[ID_SCHEDULE] [int] IDENTITY(1,1) NOT NULL,
	[ID_COURSE] [int] NULL,
	[ID_DAY] [int] NULL,
	[TIME_START] [time](7) NULL,
	[TIME_END] [time](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_SCHEDULE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsim_student_class_note]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsim_student_class_note](
	[ID_STUDENT_NOTE] [int] IDENTITY(1,1) NOT NULL,
	[ID_USER] [int] NULL,
	[ID_COURSE] [int] NULL,
	[DSC_TITLE] [nvarchar](255) NULL,
	[DSC_COMMENT] [nvarchar](500) NULL,
	[DATE_NOTE] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_STUDENT_NOTE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsit_final_results]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsit_final_results](
	[ID_RESULT] [int] IDENTITY(1,1) NOT NULL,
	[ID_USER] [int] NULL,
	[ID_COURSE] [int] NULL,
	[FINAL_SCORE] [decimal](5, 2) NULL,
	[RESULT_STATUS] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_RESULT] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsit_student_evaluation]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsit_student_evaluation](
	[ID_EVALUATION] [int] IDENTITY(1,1) NOT NULL,
	[ID_TYPE] [int] NOT NULL,
	[SCORE_OBTAINED] [decimal](5, 2) NOT NULL,
	[DSC_COMMENT] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_EVALUATION] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsit_teacher]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsit_teacher](
	[ID_TEACHER] [int] IDENTITY(1,1) NOT NULL,
	[DSC_FIRST_NAME] [nvarchar](50) NOT NULL,
	[DSC_LAST_NAME_ONE] [nvarchar](50) NOT NULL,
	[DSC_LAST_NAME_TWO] [nvarchar](50) NOT NULL,
	[DSC_EMAIL] [nvarchar](100) NOT NULL,
	[DSC_PHONE] [nvarchar](255) NOT NULL,
	[STATUS] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_TEACHER] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsit_user]    Script Date: 17/6/2025 11:42:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsit_user](
	[ID_USER] [int] IDENTITY(1,1) NOT NULL,
	[DSC_FIRST_NAME] [nvarchar](50) NOT NULL,
	[DSC_LAST_NAME_ONE] [nvarchar](50) NOT NULL,
	[DSC_IDENTIFICATION] [nvarchar](100) NOT NULL,
	[DSC_EMAIL] [nvarchar](100) NOT NULL,
	[DSC_PASSWORD] [nvarchar](255) NOT NULL,
	[DATE_CREATED] [datetime] NULL,
	[STATUS] [int] NULL,
	[DSC_CAREER] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_USER] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[tsim_course] ON 

INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (3, N'Diseño y programación de plataformas móviles', 4, N'EIF-411', N'Martes de 16:00 a 17:00', N'#FF5733', 1)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (5, N'Ingeniería en Sistemas III', 1, N'EIF406', N'Viernes de las 17:00 a las 18:00', N'#3357FF', 2)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (6, N'Inteligencia Artificial', 2, N'EIF4200', N'Sábados 13:00 - 17:00', N'#F3FF33', 4)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (7, N'Métodos de Investigación Científica en Informática', 3, N'EIF413', N'Jueves de 11:00 a 12:00', N'#FF33F3', 3)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (12, N'Programación I', 3, N'EIF201', N'Lunes 1pm-3pm', N'#ff5733', 2)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (13, N'INGLES', 8, N'ING444', N'', N'#abecbe', 6)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (1013, N'Inteligencia Artificial', 9, N'IAA-223', N'', N'#c8abfc', 6)
SET IDENTITY_INSERT [dbo].[tsim_course] OFF
GO
SET IDENTITY_INSERT [dbo].[tsim_evaluation_type] ON 

INSERT [dbo].[tsim_evaluation_type] ([ID_TYPE], [ID_COURSE], [DSC_NAME], [WEIGHT], [DATE_EVALUATION], [DSC_EVALUATION], [ID_USER]) VALUES (1, 3, N'Examen ', CAST(30.00 AS Decimal(5, 2)), CAST(N'2025-06-30T00:00:00.000' AS DateTime), N'Evaluación actualizada', 1)
INSERT [dbo].[tsim_evaluation_type] ([ID_TYPE], [ID_COURSE], [DSC_NAME], [WEIGHT], [DATE_EVALUATION], [DSC_EVALUATION], [ID_USER]) VALUES (4, 3, N'string', CAST(3.00 AS Decimal(5, 2)), CAST(N'2025-06-21T00:00:00.000' AS DateTime), N'string', 6)
INSERT [dbo].[tsim_evaluation_type] ([ID_TYPE], [ID_COURSE], [DSC_NAME], [WEIGHT], [DATE_EVALUATION], [DSC_EVALUATION], [ID_USER]) VALUES (6, 3, N'Examen Parcial', CAST(20.50 AS Decimal(5, 2)), CAST(N'2025-06-15T00:00:00.000' AS DateTime), N'Evaluación de mitad de curso', 1)
SET IDENTITY_INSERT [dbo].[tsim_evaluation_type] OFF
GO
SET IDENTITY_INSERT [dbo].[tsim_student_class_note] ON 

INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (12, 1, 3, N'Consultas HTTP', N'Clase donde vimos consultas http y el manejo de respuestas desde la controller', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (13, 2, 3, N'Jetpack Compose', N'Laboratorio usando android studio.', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (15, 1, 5, N'Plantear Tema', N'Planteamos el tema de investigacion para el proyecto final', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (16, 4, 7, N'Diseño de personaje', N'Diseñamos un personaje usando blender', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (25, 2, 3, N'string', N'string', CAST(N'2025-05-10T04:49:34.657' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (28, 2, 3, N'string', N'string', CAST(N'2025-06-15T00:40:32.820' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (1029, 6, 1013, N'Clase 8: Redes semanticas', N'Prueb', CAST(N'2025-06-14T00:00:00.000' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (1031, 6, 1013, N'titulo', N'fhdfhsd', CAST(N'2025-06-15T00:00:00.000' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (1035, 6, 13, N'Clase', N'ASFAS', CAST(N'2025-06-15T00:00:00.000' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (1036, 6, 1013, N'EDITADO', N'dsdhsds', CAST(N'2025-06-15T00:00:00.000' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (1038, 6, 1013, N'PRUEBAAA', N'ADGSD', CAST(N'2025-06-15T00:00:00.000' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (1055, 6, 1013, N'AZUCAR', N'ASFASFAFASFAF', CAST(N'2025-06-16T00:00:00.000' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (1056, 6, 13, N'JGJGHJGHJG', N'GHJGHJGHJG', CAST(N'2025-06-16T00:00:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[tsim_student_class_note] OFF
GO
SET IDENTITY_INSERT [dbo].[tsit_student_evaluation] ON 

INSERT [dbo].[tsit_student_evaluation] ([ID_EVALUATION], [ID_TYPE], [SCORE_OBTAINED], [DSC_COMMENT]) VALUES (2, 6, CAST(85.50 AS Decimal(5, 2)), N'Buen rendimiento')
SET IDENTITY_INSERT [dbo].[tsit_student_evaluation] OFF
GO
SET IDENTITY_INSERT [dbo].[tsit_teacher] ON 

INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (1, N'jose', N'miguel', N'angel', N'si@gmail.com', N'12345678', 0)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (2, N'Michael', N'Barquero', N'Salazar', N'michael.barquero.salazar@una.ac.cr', N'86826247', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (3, N'Adán', N'Carranza', N'Alfaro', N'adan.carranza.alfaro@una.ac.cr', N'85666738', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (4, N'Willy', N'Pineda', N'Lizano', N'willy.pineda.lizano@una.ac.cr', N'86683183', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (6, N'Olivier', N'Blanco', N'Sandí', N'olivier.blanco.sandi@una.ac.cr', N'89711028', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (7, N'Michael', N'Barquero', N'Villalobos', N'Michael.barquero@una.com', N'09090909', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (8, N'Ddddd', N'Ddd', N'Dddd', N'Kdkd@gmail.com', N'09090909', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (9, N'Hb77bbv', N'Bhhb', N'Jjsjsd', N'Aaron@gmail.com', N'09090909', 1)
SET IDENTITY_INSERT [dbo].[tsit_teacher] OFF
GO
SET IDENTITY_INSERT [dbo].[tsit_user] ON 

INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (1, N'Aaron', N'Matarrita', N'987654321', N'aaron.matarrita@est.una.ac.cr', N'aaronmatarrita', CAST(N'2024-03-21T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (2, N'Dilan', N'Gutiérrez', N'412345678', N'dilan.gutierrez@est.una.ac.cr', N'dilangutierrez', CAST(N'2024-03-20T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (3, N'Josue', N'Porras', N'402640062', N'josue.porras@est.una.ac.cr', N'josueporras', CAST(N'2024-03-22T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (4, N'Yeiler', N'Montes', N'400910011', N'yeiler.montes@est.una.ac.cr', N'yeilermontes', CAST(N'2024-03-23T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (5, N'Juan', N'Pérez', N'123456789', N'dani@gmail.com', N'$2b$10$dWqjlbE9wToSdotBroHacem3zHnCCZqLEz66zn27OiAflj7mhNIN.', CAST(N'2025-04-04T14:52:07.000' AS DateTime), 0, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (6, N'Aaron', N'Matarrita', N'119160537', N'aaron@gmail.com', N'$2b$10$dlKVPXqQ3lgGJwK9ty7NHuoRdMk.BY3XBybOzvlLQ7JBN0eBtrpy.', CAST(N'2025-05-09T00:03:39.000' AS DateTime), 1, N'Ingenieria')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (7, N'Dilan', N'Gutierrez', N'123436789', N'dilan@gmail.com', N'$2b$10$KMPRx5Y8DXb2hFRAq5x3U.gpv6T47njk8v527SWt1YwOk7QkQHemi', CAST(N'2025-05-09T14:41:48.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (8, N'Juan', N'Pérez', N'124456789', N'dilam1@gmail.com', N'$2b$10$5RYfno6VKEvhnBAdoDqhTOjvqpjpqRhFXFt3bnqPS7o.1FAIYMpZq', CAST(N'2025-06-14T17:12:39.000' AS DateTime), 1, N'Ingeniería en Sistemas')
SET IDENTITY_INSERT [dbo].[tsit_user] OFF
GO
ALTER TABLE [dbo].[tsim_evaluation_type] ADD  DEFAULT ('Tarea') FOR [DSC_EVALUATION]
GO
ALTER TABLE [dbo].[tsim_student_class_note] ADD  DEFAULT (getdate()) FOR [DATE_NOTE]
GO
ALTER TABLE [dbo].[tsit_user] ADD  DEFAULT ('N/A') FOR [DSC_CAREER]
GO
ALTER TABLE [dbo].[tsim_course]  WITH CHECK ADD FOREIGN KEY([ID_TEACHER])
REFERENCES [dbo].[tsit_teacher] ([ID_TEACHER])
GO
ALTER TABLE [dbo].[tsim_course]  WITH CHECK ADD FOREIGN KEY([ID_TEACHER])
REFERENCES [dbo].[tsit_teacher] ([ID_TEACHER])
GO
ALTER TABLE [dbo].[tsim_course]  WITH CHECK ADD  CONSTRAINT [FK_tsim_course_ID_USER] FOREIGN KEY([ID_USER])
REFERENCES [dbo].[tsit_user] ([ID_USER])
GO
ALTER TABLE [dbo].[tsim_course] CHECK CONSTRAINT [FK_tsim_course_ID_USER]
GO
ALTER TABLE [dbo].[tsim_evaluation_type]  WITH CHECK ADD FOREIGN KEY([ID_COURSE])
REFERENCES [dbo].[tsim_course] ([ID_COURSE])
GO
ALTER TABLE [dbo].[tsim_evaluation_type]  WITH CHECK ADD  CONSTRAINT [FK_USER] FOREIGN KEY([ID_USER])
REFERENCES [dbo].[tsit_user] ([ID_USER])
GO
ALTER TABLE [dbo].[tsim_evaluation_type] CHECK CONSTRAINT [FK_USER]
GO
ALTER TABLE [dbo].[tsim_schedule]  WITH CHECK ADD FOREIGN KEY([ID_COURSE])
REFERENCES [dbo].[tsim_course] ([ID_COURSE])
GO
ALTER TABLE [dbo].[tsim_schedule]  WITH CHECK ADD FOREIGN KEY([ID_DAY])
REFERENCES [dbo].[tsim_day] ([ID_DAY])
GO
ALTER TABLE [dbo].[tsim_student_class_note]  WITH CHECK ADD FOREIGN KEY([ID_COURSE])
REFERENCES [dbo].[tsim_course] ([ID_COURSE])
GO
ALTER TABLE [dbo].[tsim_student_class_note]  WITH CHECK ADD FOREIGN KEY([ID_USER])
REFERENCES [dbo].[tsit_user] ([ID_USER])
GO
ALTER TABLE [dbo].[tsit_final_results]  WITH CHECK ADD FOREIGN KEY([ID_COURSE])
REFERENCES [dbo].[tsim_course] ([ID_COURSE])
GO
ALTER TABLE [dbo].[tsit_final_results]  WITH CHECK ADD FOREIGN KEY([ID_USER])
REFERENCES [dbo].[tsit_user] ([ID_USER])
GO
ALTER TABLE [dbo].[tsit_student_evaluation]  WITH CHECK ADD FOREIGN KEY([ID_TYPE])
REFERENCES [dbo].[tsim_evaluation_type] ([ID_TYPE])
GO
USE [master]
GO
ALTER DATABASE [taskmind_db] SET  READ_WRITE 
GO
