USE [RealTimeChatDB]
GO
SET IDENTITY_INSERT [dbo].[User] ON 

GO
INSERT [dbo].[User] ([Id], [Name], [Email], [Password], [Info], [Avatar], [CreatedAt], [UpdatedAt]) VALUES (1, N'Alexandr Samulyak', N'samulyak.a@gmail.com', N'40bd001563085fc35165329ea1ff5c5ecbdbbeef', N'.NET Lead Developer', N'', CAST(0x0000A63701663B31 AS DateTime), CAST(0x0000A63701663B31 AS DateTime))
GO
INSERT [dbo].[User] ([Id], [Name], [Email], [Password], [Info], [Avatar], [CreatedAt], [UpdatedAt]) VALUES (2, N'Vasily Pupkin', N'vasia@pupkin.com', N'40bd001563085fc35165329ea1ff5c5ecbdbbeef', N'.NET Developer', N'', CAST(0x0000A637016678A6 AS DateTime), CAST(0x0000A637016678A6 AS DateTime))
GO
INSERT [dbo].[User] ([Id], [Name], [Email], [Password], [Info], [Avatar], [CreatedAt], [UpdatedAt]) VALUES (3, N'Ivan Ivanov', N'vania@vania.com', N'40bd001563085fc35165329ea1ff5c5ecbdbbeef', N'.Developer', N'', CAST(0x0000A637016796DD AS DateTime), CAST(0x0000A637016796DD AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[User] OFF
GO
