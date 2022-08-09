# Generated by Django 4.0.6 on 2022-08-09 17:57

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_options_alter_user_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.CharField(default=users.models.default_uuid, editable=False, max_length=36, primary_key=True, serialize=False),
        ),
        migrations.AlterUniqueTogether(
            name='user',
            unique_together={('username', 'email')},
        ),
    ]