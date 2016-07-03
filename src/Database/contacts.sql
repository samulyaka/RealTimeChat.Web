alter table [Contact] drop column LastReadAt;
go
alter table [Contact] add LastReadAt datetime;
go
insert into [Contact](UserId,ContactId,ChatUID,LastReadAt)
select us1.id,us2.id,cast(NEWID() as nvarchar(50)), getdate()
from [User] us1
cross join [User] us2
where us1.id <> us2.id
go
drop index IX_Contact on [Contact]
go
update [Contact] set ChatUID = IIF([Contact].ChatUID > c2.ChatUID, [Contact].ChatUID, c2.ChatUID)
from [Contact] 
join [Contact] c2 on [Contact].UserId = c2.ContactId and [Contact].ContactId = c2.UserId