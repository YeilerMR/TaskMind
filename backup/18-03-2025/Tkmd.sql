CREATE DATABASE taskmind_db;

USE [taskmind_db]
GO
/****** Object:  Table [dbo].[tsim_course]    Script Date: 04/04/2025 15:07:58 ******/
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
/****** Object:  Table [dbo].[tsim_day]    Script Date: 04/04/2025 15:07:58 ******/
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
/****** Object:  Table [dbo].[tsim_evaluation_type]    Script Date: 04/04/2025 15:07:58 ******/
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
PRIMARY KEY CLUSTERED 
(
	[ID_TYPE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsim_schedule]    Script Date: 04/04/2025 15:07:58 ******/
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
/****** Object:  Table [dbo].[tsim_student_class_note]    Script Date: 04/04/2025 15:07:58 ******/
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
/****** Object:  Table [dbo].[tsit_final_results]    Script Date: 04/04/2025 15:07:58 ******/
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
/****** Object:  Table [dbo].[tsit_student_evaluation]    Script Date: 04/04/2025 15:07:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsit_student_evaluation](
	[ID_EVALUATION] [int] IDENTITY(1,1) NOT NULL,
	[ID_USER] [int] NOT NULL,
	[ID_TYPE] [int] NOT NULL,
	[SCORE_OBTAINED] [decimal](5, 2) NOT NULL,
	[DSC_COMMENT] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_EVALUATION] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsit_teacher]    Script Date: 04/04/2025 15:07:58 ******/
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
/****** Object:  Table [dbo].[tsit_user]    Script Date: 04/04/2025 15:07:58 ******/
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
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (4, N'Diseño de Gráficos por Computadora', 5, N'EIF-4360', N'Miércoles de 03:00 pm a 04:00 pm', N'#33FF57', 2)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (5, N'Ingeniería en Sistemas III', 1, N'EIF406', N'Viernes de las 17:00 a las 18:00', N'#3357FF', 2)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (6, N'Inteligencia Artificial', 2, N'EIF4200', N'Sábados 13:00 - 17:00', N'#F3FF33', 4)
INSERT [dbo].[tsim_course] ([ID_COURSE], [DSC_NAME], [ID_TEACHER], [DSC_CODE], [DSC_ATTENTION], [DSC_COLOR], [ID_USER]) VALUES (7, N'Métodos de Investigación Científica en Informática', 3, N'EIF413', N'Jueves de 11:00 a 12:00', N'#FF33F3', 3)
SET IDENTITY_INSERT [dbo].[tsim_course] OFF
GO
SET IDENTITY_INSERT [dbo].[tsim_student_class_note] ON 

INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (12, 1, 3, N'Consultas HTTP', N'Clase donde vimos consultas http y el manejo de respuestas desde la controller', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (13, 2, 3, N'Jetpack Compose', N'Laboratorio usando android studio.', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (14, 3, 4, N'Taller de Scrum', N'Realizamos un taller de implementando metodologias agiles (scrum)', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (15, 1, 5, N'Plantear Tema', N'Planteamos el tema de investigacion para el proyecto final', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
INSERT [dbo].[tsim_student_class_note] ([ID_STUDENT_NOTE], [ID_USER], [ID_COURSE], [DSC_TITLE], [DSC_COMMENT], [DATE_NOTE]) VALUES (16, 4, 7, N'Diseño de personaje', N'Diseñamos un personaje usando blender', CAST(N'2025-03-28T21:45:17.100' AS DateTime))
SET IDENTITY_INSERT [dbo].[tsim_student_class_note] OFF
GO
SET IDENTITY_INSERT [dbo].[tsit_teacher] ON 

INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (1, N'jose', N'miguel', N'angel', N'si@gmail.com', N'12345678', 0)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (2, N'Michael', N'Barquero', N'Salazar', N'michael.barquero.salazar@una.ac.cr', N'86826247', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (3, N'Adán', N'Carranza', N'Alfaro', N'adan.carranza.alfaro@una.ac.cr', N'85666738', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (4, N'Willy', N'Pineda', N'Lizano', N'willy.pineda.lizano@una.ac.cr', N'86683183', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (5, N'Rachel', N'Bolívar', N'Morales', N'rachel.bolivar.morales@una.ac.cr', N'86683183', 1)
INSERT [dbo].[tsit_teacher] ([ID_TEACHER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_LAST_NAME_TWO], [DSC_EMAIL], [DSC_PHONE], [STATUS]) VALUES (6, N'Olivier', N'Blanco', N'Sandí', N'olivier.blanco.sandi@una.ac.cr', N'89711028', 1)
SET IDENTITY_INSERT [dbo].[tsit_teacher] OFF
GO
SET IDENTITY_INSERT [dbo].[tsit_user] ON 

INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (1, N'Aaron', N'Matarrita', N'987654321', N'aaron.matarrita@est.una.ac.cr', N'aaronmatarrita', CAST(N'2024-03-21T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (2, N'Dilan', N'Gutiérrez', N'412345678', N'dilan.gutierrez@est.una.ac.cr', N'dilangutierrez', CAST(N'2024-03-20T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (3, N'Josue', N'Porras', N'402640062', N'josue.porras@est.una.ac.cr', N'josueporras', CAST(N'2024-03-22T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (4, N'Yeiler', N'Montes', N'400910011', N'yeiler.montes@est.una.ac.cr', N'yeilermontes', CAST(N'2024-03-23T14:00:00.000' AS DateTime), 1, N'Ingeniería en Sistemas')
INSERT [dbo].[tsit_user] ([ID_USER], [DSC_FIRST_NAME], [DSC_LAST_NAME_ONE], [DSC_IDENTIFICATION], [DSC_EMAIL], [DSC_PASSWORD], [DATE_CREATED], [STATUS], [DSC_CAREER]) VALUES (5, N'Juan', N'Pérez', N'123456789', N'dani@gmail.com', N'$2b$10$dWqjlbE9wToSdotBroHacem3zHnCCZqLEz66zn27OiAflj7mhNIN.', CAST(N'2025-04-04T14:52:07.000' AS DateTime), 0, N'Ingeniería en Sistemas')
SET IDENTITY_INSERT [dbo].[tsit_user] OFF
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
ALTER TABLE [dbo].[tsit_student_evaluation]  WITH CHECK ADD FOREIGN KEY([ID_USER])
REFERENCES [dbo].[tsit_user] ([ID_USER])
GO

