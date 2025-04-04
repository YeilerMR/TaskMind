CREATE DATABASE taskmind_db;

USE [taskmind_db]
GO
/****** Object:  Table [dbo].[tsim_course]    Script Date: 11/03/2025 19:14:42 ******/
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
PRIMARY KEY CLUSTERED 
(
	[ID_COURSE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tsim_day]    Script Date: 11/03/2025 19:14:42 ******/
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
/****** Object:  Table [dbo].[tsim_schedule]    Script Date: 11/03/2025 19:14:42 ******/
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
/****** Object:  Table [dbo].[tsim_student_class_note]    Script Date: 11/03/2025 19:14:42 ******/
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
/****** Object:  Table [dbo].[tsim_evaluation_type]    Script Date: 11/03/2025 19:14:42 ******/
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
/****** Object:  Table [dbo].[tsit_student_evaluation]    Script Date: 11/03/2025 19:14:42 ******/
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
/****** Object:  Table [dbo].[tsit_teacher]    Script Date: 11/03/2025 19:14:42 ******/
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
/****** Object:  Table [dbo].[tsit_final_results]    Script Date: 11/03/2025 19:14:42 ******/
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
/****** Object:  Table [dbo].[tsit_user]    Script Date: 11/03/2025 19:14:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tsit_user](
	[ID_USER] [int] IDENTITY(1,1) NOT NULL,
	[DSC_FIRST_NAME] [nvarchar](50) NOT NULL,
	[DSC_LAST_NAME_ONE] [nvarchar](50) NOT NULL,
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
ALTER TABLE [dbo].[tsim_student_class_note] ADD  DEFAULT (getdate()) FOR [DATE_NOTE]
GO
ALTER TABLE [dbo].[tsit_user] ADD  DEFAULT ('N/A') FOR [DSC_CAREER]
GO
ALTER TABLE [dbo].[tsim_course]  WITH CHECK ADD FOREIGN KEY([ID_TEACHER])
REFERENCES [dbo].[tsit_teacher] ([ID_TEACHER])
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
ALTER TABLE [dbo].[tsim_evaluation_type]  WITH CHECK ADD FOREIGN KEY([ID_COURSE])
REFERENCES [dbo].[tsim_course] ([ID_COURSE])
GO
ALTER TABLE [dbo].[tsit_student_evaluation]  WITH CHECK ADD FOREIGN KEY([ID_TYPE])
REFERENCES [dbo].[tsim_evaluation_type] ([ID_TYPE])
GO
ALTER TABLE [dbo].[tsit_student_evaluation]  WITH CHECK ADD FOREIGN KEY([ID_USER])
REFERENCES [dbo].[tsit_user] ([ID_USER])
GO
ALTER TABLE [dbo].[tsit_final_results]  WITH CHECK ADD FOREIGN KEY([ID_COURSE])
REFERENCES [dbo].[tsim_course] ([ID_COURSE])
GO
ALTER TABLE [dbo].[tsit_final_results]  WITH CHECK ADD FOREIGN KEY([ID_USER])
REFERENCES [dbo].[tsit_user] ([ID_USER])
GO
