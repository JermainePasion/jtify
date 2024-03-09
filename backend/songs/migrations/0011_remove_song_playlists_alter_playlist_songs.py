# Generated by Django 5.0.1 on 2024-02-28 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('songs', '0010_remove_song_playlist_song_playlists_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='song',
            name='playlists',
        ),
        migrations.AlterField(
            model_name='playlist',
            name='songs',
            field=models.ManyToManyField(related_name='playlists', to='songs.song'),
        ),
    ]