import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761212453811 implements MigrationInterface {
    name = 'InitialSchema1761212453811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`body\` text NOT NULL, \`articleId\` int NOT NULL, \`authorId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(50) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`bio\` varchar(1000) NULL, \`image\` varchar(255) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_d90243459a697eadb8ad56e909\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`slug\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(500) NOT NULL, \`body\` text NOT NULL, \`tagList\` text NOT NULL, \`favoritesCount\` int NOT NULL DEFAULT '0', \`authorId\` int NULL, UNIQUE INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article_tags\` (\`article_id\` int NOT NULL, \`tag_id\` int NOT NULL, INDEX \`IDX_f8c9234a4c4cb37806387f0c9e\` (\`article_id\`), INDEX \`IDX_1325dd0b98ee0f8f673db6ce19\` (\`tag_id\`), PRIMARY KEY (\`article_id\`, \`tag_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles_favorited_by_users\` (\`articlesId\` int NOT NULL, \`usersId\` int NOT NULL, INDEX \`IDX_a4edf351aa152ef0143a6d22c5\` (\`articlesId\`), INDEX \`IDX_be5e80e58412ae12f710f85678\` (\`usersId\`), PRIMARY KEY (\`articlesId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_b0011304ebfcb97f597eae6c31f\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4548cc4a409b8651ec75f70e280\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_f8c9234a4c4cb37806387f0c9e9\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_1325dd0b98ee0f8f673db6ce194\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles_favorited_by_users\` ADD CONSTRAINT \`FK_a4edf351aa152ef0143a6d22c5b\` FOREIGN KEY (\`articlesId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`articles_favorited_by_users\` ADD CONSTRAINT \`FK_be5e80e58412ae12f710f856782\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles_favorited_by_users\` DROP FOREIGN KEY \`FK_be5e80e58412ae12f710f856782\``);
        await queryRunner.query(`ALTER TABLE \`articles_favorited_by_users\` DROP FOREIGN KEY \`FK_a4edf351aa152ef0143a6d22c5b\``);
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_1325dd0b98ee0f8f673db6ce194\``);
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_f8c9234a4c4cb37806387f0c9e9\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4548cc4a409b8651ec75f70e280\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_b0011304ebfcb97f597eae6c31f\``);
        await queryRunner.query(`DROP INDEX \`IDX_be5e80e58412ae12f710f85678\` ON \`articles_favorited_by_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a4edf351aa152ef0143a6d22c5\` ON \`articles_favorited_by_users\``);
        await queryRunner.query(`DROP TABLE \`articles_favorited_by_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_1325dd0b98ee0f8f673db6ce19\` ON \`article_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_f8c9234a4c4cb37806387f0c9e\` ON \`article_tags\``);
        await queryRunner.query(`DROP TABLE \`article_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` ON \`articles\``);
        await queryRunner.query(`DROP TABLE \`articles\``);
        await queryRunner.query(`DROP INDEX \`IDX_d90243459a697eadb8ad56e909\` ON \`tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
    }

}
