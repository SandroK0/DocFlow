"""add inTrash propety to documents and folders

Revision ID: b6494e0ecf0c
Revises: 48a4a8025b78
Create Date: 2025-01-09 01:26:20.135877

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b6494e0ecf0c'
down_revision = '48a4a8025b78'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.add_column(sa.Column('in_trash', sa.Boolean(), nullable=False))

    with op.batch_alter_table('folder', schema=None) as batch_op:
        batch_op.add_column(sa.Column('in_trash', sa.Boolean(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('folder', schema=None) as batch_op:
        batch_op.drop_column('in_trash')

    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.drop_column('in_trash')

    # ### end Alembic commands ###
